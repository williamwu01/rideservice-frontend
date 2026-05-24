import { ArrowRight, Clock } from "lucide-react";

const posts = [
  {
    title: "Gas Prices Hit $2/Litre in Ontario — How Carpooling Can Save You Hundreds",
    excerpt:
      "With gas prices soaring across Ontario, more Canadians are turning to rideshare as a cost-effective alternative. Here's how Loop can help you cut costs.",
    date: "May 8, 2026",
    readTime: "4 min read",
    category: "Savings",
    color: "bg-orange-100 text-orange-700",
  },
  {
    title: "Carpool vs. Bus vs. Train vs. Driving: Which Is Best for Your Commute?",
    excerpt:
      "We break down the real costs, convenience, and environmental impact of each transportation option so you can make the smartest choice for your commute.",
    date: "May 4, 2026",
    readTime: "6 min read",
    category: "Comparison",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "5 Ways to Use Loop Delivery for Your Business or Personal Needs",
    excerpt:
      "Loop's new package delivery feature opens up exciting possibilities. From sending gifts to running small business logistics — here's how to make it work for you.",
    date: "Jan 2, 2026",
    readTime: "5 min read",
    category: "Delivery",
    color: "bg-green-100 text-green-700",
  },
];

export default function Blog() {
  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              Blog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Latest from Loop
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors whitespace-nowrap"
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
            >
              {/* Placeholder image */}
              <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <div className="w-16 h-16 bg-indigo-200 rounded-2xl flex items-center justify-center">
                  <span className="text-indigo-600 text-2xl">✍️</span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.color}`}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 leading-snug flex-1">{post.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <a
                    href="#"
                    className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 flex items-center gap-1"
                  >
                    Read more <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
