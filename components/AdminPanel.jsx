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

    const cleanName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${cleanName}`;

    // ⭐ Upload image to Supabase Storage
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

    const { error: insertError } = await supabase.from("products").insert([
      {
        title,
        description: desc,
        price,
        image_path: imagePath,
      },
    ]);

    setLoading(false);

    if (insertError) {
      return alert(insertError.message);
    }

    // Reset form
    setTitle("");
    setDesc("");
    setPrice("");
    setFile(null);

    // Refresh admin panel
    if (onAdded) onAdded();
  }

  return (
    <form className="space-y-3" onSubmit={handleAdd}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="input"
      />

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description"
        className="input"
      />

      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className="input"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        disabled={loading}

