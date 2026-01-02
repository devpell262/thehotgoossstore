import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const companyLinks = [
    { name: "About Us", href: "#about" },
    { name: "Contact", href: "#contact" },
    { name: "Blog", href: "#blog" },
  ];

  const shopLinks = [
    { name: "All Products", href: "/shop" },
    { name: "Bags", href: "/shop?category=Bags" },
    { name: "Apparel", href: "/shop?category=Apparel" },
    { name: "Accessories", href: "/shop?category=Accessories" },
  ];

  const supportLinks = [
    { name: "Shipping", href: "#shipping" },
    { name: "Returns", href: "#returns" },
    { name: "FAQs", href: "#faqs" },
  ];

  const linkColumns = [
    { title: "Company", links: companyLinks },
    { title: "Shop", links: shopLinks },
    { title: "Support", links: supportLinks },
  ];

  return (
    <footer className="bg-white dark:bg-[#121212]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#5E55E8] to-[#876DFF] rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-white transform rotate-12 rounded-sm"></div>
              </div>
              <div className="text-2xl font-semibold">
                <span className="text-[#5E55E8]">The</span>
                <span className="text-[#111318] dark:text-white">HotGoss</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[#56576B] dark:text-gray-300 leading-relaxed max-w-[36ch]">
              Your destination for trendy products and the latest gossip. Shop
              the hottest items and stay in the know.
            </p>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {linkColumns.map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold text-[#1F2027] dark:text-white mb-2">
                  {column.title}
                </h3>
                <ul className="space-y-1.5">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-[#58596E] dark:text-gray-300 hover:text-[#5E55E8] dark:hover:text-[#876DFF] active:text-[#4A47CC] dark:active:text-[#7B6EFF] focus:text-[#5E55E8] dark:focus:text-[#876DFF] focus:outline-none focus:ring-2 focus:ring-[#5E55E8] focus:ring-opacity-50 transition-colors duration-150 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#EAECEF] dark:border-[#333333] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#56576B] dark:text-gray-300 text-sm">
            © 2024 TheHotGoss
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#instagram"
              className="text-[#58596E] dark:text-gray-300 hover:text-[#5E55E8] dark:hover:text-[#876DFF] active:text-[#4A47CC] dark:active:text-[#7B6EFF] focus:text-[#5E55E8] dark:focus:text-[#876DFF] focus:outline-none focus:ring-2 focus:ring-[#5E55E8] focus:ring-opacity-50 transition-colors duration-150 p-2 rounded-lg hover:bg-[#F8F9FF] dark:hover:bg-[#252525] active:bg-[#F0F1FF] dark:active:bg-[#333333]"
              aria-label="TheHotGoss on Instagram"
            >
              <Instagram size={22} />
            </a>
            <a
              href="#twitter"
              className="text-[#58596E] dark:text-gray-300 hover:text-[#5E55E8] dark:hover:text-[#876DFF] active:text-[#4A47CC] dark:active:text-[#7B6EFF] focus:text-[#5E55E8] dark:focus:text-[#876DFF] focus:outline-none focus:ring-2 focus:ring-[#5E55E8] focus:ring-opacity-50 transition-colors duration-150 p-2 rounded-lg hover:bg-[#F8F9FF] dark:hover:bg-[#252525] active:bg-[#F0F1FF] dark:active:bg-[#333333]"
              aria-label="TheHotGoss on Twitter"
            >
              <Twitter size={22} />
            </a>
            <a
              href="#facebook"
              className="text-[#58596E] dark:text-gray-300 hover:text-[#5E55E8] dark:hover:text-[#876DFF] active:text-[#4A47CC] dark:active:text-[#7B6EFF] focus:text-[#5E55E8] dark:focus:text-[#876DFF] focus:outline-none focus:ring-2 focus:ring-[#5E55E8] focus:ring-opacity-50 transition-colors duration-150 p-2 rounded-lg hover:bg-[#F8F9FF] dark:hover:bg-[#252525] active:bg-[#F0F1FF] dark:active:bg-[#333333]"
              aria-label="TheHotGoss on Facebook"
            >
              <Facebook size={22} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
