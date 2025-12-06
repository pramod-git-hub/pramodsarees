import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminPanel({ onAdded }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();

    if (!file) return alert("Select image");
    setLoading(true);

    // Clean filename
    const cleanName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${cleanName}`;

    // ⭐ Upload image to Supabase Storage (product-images bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setLoading(false);
      return alert("Image upload failed: " + uploadError.message);
    }

    const imagePath = uploadData.path;

    // ⭐ Insert product record
    const { error: insertError } = await supabase
      .from("products")
      .insert([
        {
          title,
          description: desc,
          price,
          image_path: imagePath,
        },
      ]);

    setLoading(false);

    if (insertError) return alert(insertError.message);

    // Reset form
    setTitle("");
    setDesc("");
    setPrice("");
    setFile(null);

    // Refresh admin panel data
    if (onAdded) onAdded();
  }

  return (
    <for

