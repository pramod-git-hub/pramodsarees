export const dynamic = "force-dynamic";

import Header from "../components/Header";
import AdminPanel from "../components/AdminPanel";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export default function Admin({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);

  async function refresh() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    const enriched = data.map((p) => ({
      ...p,
      title: p.title ?? "No Title",
      description: p.description ?? "",
      price: p.price ?? "0",
      image_url:
        supabase.storage
          .from("product-images")
          .getPublicUrl(p.image_path).data.publicUrl || "",
    }));

    setProducts(enriched);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    await refresh();
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Add Product</h3>
            <AdminPanel onAdded={refresh} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Products</h3>

            <div className="space-y-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image_url}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div>
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm">₹{p.price}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ✔ FIXED getServerSideProps (safe SSR)
export async function getServerSideProps() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const enriched = data.map((p) => ({
    ...p,
    title: p.title ?? "No Title",
    description: p.description ?? "",
    price: p.price ?? "0",
    image_url:
      supabase.storage
        .from("product-images")
        .getPublicUrl(p.image_path).data.publicUrl || "",
  }));

  return { props: { initialProducts: enriched } };
}
