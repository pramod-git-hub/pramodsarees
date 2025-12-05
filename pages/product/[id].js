import { supabase } from "../../lib/supabaseClient";

export async function getServerSideProps({ params }) {
  const { id } = params;

  if (!id) return { notFound: true };

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) return { notFound: true };

  const { data: urlData } = supabase
    .storage
    .from("product-images")
    .getPublicUrl(product.image_path);

  return {
    props: {
      product: {
        ...product,
        title: product.title ?? "No Title",
        description: product.description ?? "No Description",
        price: product.price ?? "0",
        image_url: urlData?.publicUrl || "",
      },
    },
  };
}

export default function ProductPage({ product }) {
  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", gap: "40px" }}>
        
        <img
          src={product.image_url}
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
