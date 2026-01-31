open Lwt.Infix
open Dream
open Yojson

let json_of_body req = Dream.body req >|= Yojson.Safe.from_string

let respond_json ?(status = `OK) j =
  Dream.json ~status (Yojson.Safe.to_string j)

let allowed_origins =
  [
    "http://localhost:5173";
    "https://jg-encryptor.vercel.app";
    "https://jg-encryptor-git-main-joshuas-projects-7f252398.vercel.app";
    "https://jg-encryptor-d8ogqxv9x-joshuas-projects-7f252398.vercel.app";
  ]

let cors_headers_for req =
  match Dream.header req "Origin" with
  | Some origin when List.mem origin allowed_origins ->
      [
        ("Access-Control-Allow-Origin", origin);
        ("Vary", "Origin");
        ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ("Access-Control-Allow-Headers", "Content-Type, Authorization");
        ("Access-Control-Max-Age", "86400");
      ]
  | _ ->
      [
        ("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        ("Access-Control-Allow-Headers", "Content-Type, Authorization");
        ("Access-Control-Max-Age", "86400");
      ]

let cors_middleware inner_handler req =
  inner_handler req >|= fun resp ->
  let headers = cors_headers_for req in
  List.fold_left
    (fun r (k, v) ->
      Dream.add_header r k v;
      r)
    resp headers

let options_handler req =
  Dream.respond ~status:`No_Content ~headers:(cors_headers_for req) ""

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
  Dream.run ~port:8080 @@ Dream.logger @@ cors_middleware
  @@ Dream.router
       [
         Dream.options "/**" options_handler;
         Dream.post "/api/encrypt-text" encrypt_handler;
         Dream.post "/api/decrypt-text" decrypt_handler;
       ]
