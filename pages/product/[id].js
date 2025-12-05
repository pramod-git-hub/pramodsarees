import { supabase } from "../../lib/supabaseClient";

export async function getServerSideProps({ params }) {
  const { id } = params;

  // Fetch product
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    console.log("PRODUCT ERROR:", error);
    return { notFound: true };
  }

  // Convert image_path → full public URL
  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(product.image_path);

  const publicUrl = urlData?.publicUrl || null;

  return {
    props: {
      product: {
        ...product,
        image_url: publicUrl, // Always send final URL to component
      },
    },
  };
}

export default function ProductPage({ product }) {
  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", gap: "40px" }}>
        <img
          src={product.image_url || "/placeholder.png"}
          alt={product.title}
          style={{
            width: "500px",
            height: "500px",
            objectFit: "cover",
            background: "#eee",
            borderRadius: "10px",
          }}
        />

        <div>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <h2>₹{product.price}</h2>

          <button
            style={{
              padding: "10px 20px",
              background: "#d97706",
              border: "none",
              color: "#fff",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
