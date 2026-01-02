export default function AdminProducts() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check auth
    if (typeof window !== 'undefined' && localStorage.getItem("admin_auth") !== "true") {
      window.location.href = "/admin/login";
      return;
    }
    
    setProducts([]);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Product Management</h1>
            <p className="text-gray-400 mt-2">Manage your store inventory</p>
          </div>
          <div className="flex gap-4">
            <a href="/admin" className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
              ← Back
            </a>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition">
              Logout
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <h3 className="text-2xl font-bold mb-2">No Products Yet</h3>
          <p className="text-gray-400 mb-6">Get started by adding your first product</p>
        </div>
      </div>
    </div>
  );
}
