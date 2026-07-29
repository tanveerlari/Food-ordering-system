import { useState, useEffect } from "react";
import { listenToMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from "../menuService";

const CATEGORIES = ["popular", "curry", "ramen", "teppanyaki"];

function AdminMenuPanel({ onClose }) {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "popular",
    image: "",
    description: "",
  });

  useEffect(() => {
    const unsubscribe = listenToMenuItems(setItems);
    return () => unsubscribe();
  }, []);

  function resolveImageSrc(val) {
    if (!val) return "";
    const v = val.trim();
    if (v.startsWith("http") || v.startsWith("/")) return v;
    return `/image/${v}`;
  }

  function resetForm() {
    setForm({ name: "", price: "", category: "popular", image: "", description: "" });
    setEditingId(null);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price) {
      alert("Please fill name and price");
      return;
    }

    const itemData = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category,
      image: resolveImageSrc(form.image.trim()),
      description: form.description.trim(),
    };

    if (editingId) {
      await updateMenuItem(editingId, itemData);
    } else {
      await addMenuItem(itemData);
    }

    resetForm();
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      image: item.image || "",
      description: item.description || "",
    });
  }

  async function handleDelete(itemId) {
    if (window.confirm("Delete this item?")) {
      await deleteMenuItem(itemId);
    }
  }

  return (
    <div className="admin-menu-overlay">
      <div className="admin-menu-topbar">
        <h2>🍽️ Manage Menu Items</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="admin-menu-content">
        <div className="admin-form">
          <h3>{editingId ? "Edit Item" : "Add New Item"}</h3>

          <input
            className="admin-input"
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="admin-input"
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <select
            className="admin-input"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            className="admin-input"
            placeholder="Image filename or URL (e.g. prawn.jpg or /image/prawn.jpg)"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />

          {form.image && (
            <div className="image-preview-wrap">
              <img
                src={resolveImageSrc(form.image)}
                alt="preview"
                className="image-preview"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}

          <textarea
            className="admin-input admin-textarea"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="admin-form-buttons">
            <button className="admin-save-btn" onClick={handleSave}>
              {editingId ? "Update Item" : "Add Item"}
            </button>
            {editingId && (
              <button className="admin-cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="admin-items-list">
          <h3>All Items ({items.length})</h3>
          {items.map((item) => (
            <div key={item.id} className="admin-item-row">
              <div className="admin-item-info">
                <span className="admin-item-name">{item.name}</span>
                <span className="admin-item-meta">
                  {item.category} · {item.price.toFixed(2)} ₹
                </span>
              </div>
              <div className="admin-item-actions">
                <button className="admin-edit-btn" onClick={() => handleEdit(item)}>
                  Edit
                </button>
                <button className="admin-delete-btn" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMenuPanel;