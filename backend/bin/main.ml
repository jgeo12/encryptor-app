open Lwt.Infix
open Dream
open Yojson

(* -------- helpers -------- *)

let json_of_body req = Dream.body req >|= Yojson.Safe.from_string

let respond_json ?(status = `OK) j =
  Dream.json ~status (Yojson.Safe.to_string j)

(* -------- CORS -------- *)

let allowed_origins =
  [
    "http://localhost:5173";
    "https://jg-encryptor.vercel.app";
    "https://jg-encryptor-git-main-joshuas-projects-7f252398.vercel.app";
    "https://jg-encryptor-d8ogqxv9x-joshuas-projects-7f252398.vercel.app";
  ]

let cors_headers_for req =
  let origin_opt = Dream.header req "Origin" in
  Dream.log "Origin header: %s"
    (match origin_opt with
    | Some o -> o
    | None -> "<none>");
  match origin_opt with
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
  cors_headers_for req |> List.iter (fun (k, v) -> Dream.add_header resp k v);
  resp

(* IMPORTANT: do NOT add headers here, middleware will add them once *)
let options_handler _req = Dream.respond ~status:`No_Content ""

(* -------- validation -------- *)

let parse_key s =
  let is_digit c = c >= '0' && c <= '9' in
  if String.length s = 8 && String.for_all is_digit s then Ok (int_of_string s)
  else Error "Key must be exactly 8 numeric digits"

(* -------- handlers -------- *)

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

(* -------- app -------- *)

let port =
  match Sys.getenv_opt "PORT" with
  | Some p -> int_of_string p
  | None -> 8080

let () =
  Printf.printf "Starting Dream server on PORT=%d\n%!" port;
  Printf.printf "About to call Dream.run on port=%d\n%!" port;
  Dream.run ~interface:"0.0.0.0" ~port
  @@ Dream.logger @@ cors_middleware
  @@ Dream.router
       [
         Dream.get "/" (fun _ -> Dream.respond "ok");
         Dream.options "/**" options_handler;
         Dream.post "/api/encrypt-text" encrypt_handler;
         Dream.post "/api/decrypt-text" decrypt_handler;
       ]
