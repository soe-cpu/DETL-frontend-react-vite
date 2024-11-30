import categoryStore from "@/store/categoryStore";
import itemStore from "@/store/itemStore";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

const HomePage = () => {
  const { categories, fetchCategory } = categoryStore();
  const { items, fetchItem } = itemStore();

  useEffect(() => {
    fetchCategory(10);
    fetchItem(10);
  }, [fetchItem, fetchCategory]);
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>DETL - Home</title>
      </Helmet>
      <div>
        <p className="flex items-center gap-2 font-semibold text-2xl">
          Hi, Welcome back
          <span>
            <img src="hand.png" alt="" className="w-6 h-6" />
          </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 pt-4">
          <div>
            <div className="bg-green-100 rounded-xl py-10 flex justify-center items-center flex-col gap-4">
              <svg
                className="w-10 h-10 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                />
              </svg>

              <p className="text-3xl font-bold">1</p>
              <p className="text-sm">Categories</p>
            </div>
          </div>
          <div>
            <div className="bg-blue-100 rounded-xl py-10 flex justify-center items-center flex-col gap-4">
              <svg
                className="w-10 h-10 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 11H4m15.5 5a.5.5 0 0 0 .5-.5V8a1 1 0 0 0-1-1h-3.75a1 1 0 0 1-.829-.44l-1.436-2.12a1 1 0 0 0-.828-.44H8a1 1 0 0 0-1 1M4 9v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-3.75a1 1 0 0 1-.829-.44L9.985 8.44A1 1 0 0 0 9.157 8H5a1 1 0 0 0-1 1Z"
                />
              </svg>

              <p className="text-3xl font-bold">1</p>
              <p className="text-sm">Items</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <h1 className="font-semibold text-xl">Recently Companies</h1>
            <div className="relative overflow-x-auto mt-4">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.data.categories.map((c) => {
                    return (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">{c.name}</td>
                        <td className="px-6 py-4">{c.created_at}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <h1 className="font-semibold text-xl">Recently Employees</h1>
            <div className="relative overflow-x-auto mt-4">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items?.data.items.map((c) => {
                    return (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">{c.title}</td>
                        <td className="px-6 py-4">{c.description}</td>
                        <td className="px-6 py-4">{c.category.name}</td>
                        <td className="px-6 py-4">{c.created_at}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
