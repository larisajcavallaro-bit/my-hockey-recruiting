const NewsletterCTA = () => {
  return (
    <section className="bg-button-clr1 py-16 px-4 my-12 rounded-2xl max-w-7xl mx-auto text-center text-white">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-blue-500 rounded-lg">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-2">
        Get Youth Hockey Insights by Email
      </h2>
      <p className="text-blue-100 mb-8 max-w-xl mx-auto">
        Occasional articles to help families navigate youth hockey — covering
        development, teams, training, and decision-making.
      </p>
      <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 min-w-0 px-5 py-4 text-base rounded-lg bg-background text-sub-text1 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button className="w-full sm:w-auto shrink-0 bg-white text-sub-text1 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
          Subscribe Now
        </button>
      </form>
    </section>
  );
};

export default NewsletterCTA;
