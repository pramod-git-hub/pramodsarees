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

<<<<<<< HEAD
    // Upload
=======
    // Upload to Supabase Storage
>>>>>>> 0a303c1 (Fix product page image URL)
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, fs.createReadStream(file.filepath), {
        contentType: file.mimetype,
      });

<<<<<<< HEAD
    if (uploadError) return res.status(500).json({ error: uploadError.message });

=======
    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    // Public URL
>>>>>>> 0a303c1 (Fix product page image URL)
    const publicUrl = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName).data.publicUrl;

<<<<<<< HEAD
=======
    // Insert product into DB
>>>>>>> 0a303c1 (Fix product page image URL)
    const { error: insertError } = await supabase.from("products").insert({
      title: fields.title,
      description: fields.description,
      price: fields.price,
      image_url: publicUrl,
    });

<<<<<<< HEAD
    if (insertError) return res.status(500).json({ error: insertError.message });

    res.status(200).json({ message: "Product Added", url: publicUrl });
=======
    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(200).json({
      message: "Product Added",
      url: publicUrl,
    });
>>>>>>> 0a303c1 (Fix product page image URL)

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
<<<<<<< HEAD
=======

>>>>>>> 0a303c1 (Fix product page image URL)
