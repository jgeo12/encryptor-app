open Lwt.Infix
open Dream
open Yojson

let json_of_body req = Dream.body req >|= Yojson.Safe.from_string

let respond_json ?(status = `OK) j =
  Dream.json ~status (Yojson.Safe.to_string j)

let add_cors r =
  Dream.add_header r "Access-Control-Allow-Origin" "*";
  Dream.add_header r "Access-Control-Allow-Headers" "Content-Type";
  Dream.add_header r "Access-Control-Allow-Methods" "POST, OPTIONS";
  r

let cors_mw handler req =
  match Dream.method_ req with
  | `OPTIONS -> Dream.empty `No_Content |> Lwt.map add_cors
  | _ -> handler req >|= add_cors

let parse_key s =
  let is_digit c = c >= '0' && c <= '9' in
  if String.length s = 8 && String.for_all is_digit s then Ok (int_of_string s)
  else Error "Key must be exactly 8 numeric digits"

let encrypt_handler req =
  json_of_body req >>= fun j ->
  let open Yojson.Safe.Util in
  try
    let text = j |> member "text" |> to_string in
    let key_s = j |> member "key" |> to_string in
    match parse_key key_s with
    | Error msg ->
        respond_json ~status:`Bad_Request (`Assoc [ ("error", `String msg) ])
    | Ok key ->
        let out = Encryptor.Service.encrypt_text text key in
        respond_json (`Assoc [ ("ciphertext", `String out) ])
  with _ ->
    respond_json ~status:`Bad_Request
      (`Assoc [ ("error", `String "Invalid JSON") ])

let decrypt_handler req =
  json_of_body req >>= fun j ->
  let open Yojson.Safe.Util in
  try
    let ciphertext = j |> member "ciphertext" |> to_string in
    let key_s = j |> member "key" |> to_string in
    match parse_key key_s with
    | Error msg ->
        respond_json ~status:`Bad_Request (`Assoc [ ("error", `String msg) ])
    | Ok key ->
        let out = Encryptor.Service.decrypt_text ciphertext key in
        respond_json (`Assoc [ ("text", `String out) ])
  with _ ->
    respond_json ~status:`Bad_Request
      (`Assoc [ ("error", `String "Invalid JSON") ])

let () =
  Dream.run ~port:8080 @@ Dream.logger @@ cors_mw
  @@ Dream.router
       [
         Dream.post "/api/encrypt-text" encrypt_handler;
         Dream.post "/api/decrypt-text" decrypt_handler;
         Dream.options "/api/encrypt-text" (fun _ -> Dream.empty `No_Content);
         Dream.options "/api/decrypt-text" (fun _ -> Dream.empty `No_Content);
       ]