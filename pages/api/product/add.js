import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: false });
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = files.image;
    const bucket = "product-images";
    const fileName = `${Date.now()}-${file.originalFilename}`;

    // Upload
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, fs.createReadStream(file.filepath), {
        contentType: file.mimetype,
      });

    if (uploadError)
      return res.status(500).json({ error: uploadError.message });

    const publicUrl = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName).data.publicUrl;

    const { error: insertError } = await supabase.from("products").insert({
      title: fields.title,
      description: fields.description,
      price: fields.price,
      image_path: fileName,
    });

    if (insertError)
      return res.status(500).json({ error: insertError.message });

    res.status(200).json({ message: "Product Added", url: publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

