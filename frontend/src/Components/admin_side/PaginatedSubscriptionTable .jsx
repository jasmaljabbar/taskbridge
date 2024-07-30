 export const PaginatedSubscriptionTable = ({ subscriptions, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage }) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = subscriptions.slice(indexOfFirstItem, indexOfLastItem);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    return (
      <>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Full Name</th>
              <th className="py-2 px-4 border-b">Subscription Start Date</th>
              <th className="py-2 px-4 border-b">Subscription Type</th>
              <th className="py-2 px-4 border-b">Subscription Price</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((subscription, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{subscription.full_name}</td>
                <td className="py-2 px-4 border-b">{new Date(subscription.subscription_start_date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{subscription.subscription_type}</td>
                <td className="py-2 px-4 border-b">{subscription.subscription_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between items-center">
          <select
            className="border rounded p-2"
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            value={itemsPerPage}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
          <div>
            {Array.from({ length: Math.ceil(subscriptions.length / itemsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };