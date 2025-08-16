open Util
open Blowfish

(**[encrypt_text content key] encrypts the [content] string using the user's 8
   digit [key]*)
let encrypt_text content key =
  try
    let rec split_into_chunks str acc =
      if String.length str <= 8 then List.rev (str :: acc)
      else
        let chunk = String.sub str 0 8 in
        let rest = String.sub str 8 (String.length str - 8) in
        split_into_chunks rest (chunk :: acc)
    in
    let message_chunks = split_into_chunks content [] in
    let encrypted_chunks =
      List.map (fun chunk -> encrypt chunk key) message_chunks
    in
    String.concat "" encrypted_chunks
  with _ -> failwith "Error occurred during file level encryption."

(**[decrypt content key] decrypts the [content] string (ciphertext) using the
   user's 8 digit [key]*)
let decrypt_text content key =
  try
    let rec split_into_chunks str acc =
      if String.length str <= 96 then List.rev (str :: acc)
      else
        let chunk = String.sub str 0 96 in
        let rest = String.sub str 96 (String.length str - 96) in
        split_into_chunks rest (chunk :: acc)
    in
    let ciphertext_chunks = split_into_chunks content [] in
    let decrypted_chunks =
      List.map (fun chunk -> decrypt chunk key) ciphertext_chunks
    in
    String.concat "" decrypted_chunks
  with _ -> failwith "Error occurred during file level decryption."
