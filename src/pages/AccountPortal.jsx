import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/User_Context";
import OrderItem from "../components/OrderItem";
import ReviewItem from "../components/ReviewItem";
import Settings from "../components/Settings";
import Loading from "../components/Loading";
import { getTime } from "../helpers";

const AccountPortal = () => {
  const { getUserOrders, user_orders, getUserReviews, user_reviews } =
    useUserContext();

  const [showOrders, setShowOrders] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("paid");

  const displayOrders = () => {
    setShowReviews(false);
    setShowSettings(false);
    setShowOrders(true);
  };
  const displayReviews = () => {
    setShowOrders(false);
    setShowSettings(false);
    setShowReviews(true);
  };
  const displaySettings = () => {
    setShowReviews(false);
    setShowOrders(false);
    setShowSettings(true);
  };

  const updateSort = (e) => {
    setSort(e.target.value);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div
        className={`z-10 fixed top-[52px] left-0 w-full p-2 bg-green-100
      `}
      >
        <div className="flex justify-evenly">
          <button
            onClick={displayOrders}
            className={`text-xl font-heading transition-all duration-500 hover:text-green-500 underline ${
              showOrders ? "text-green-500" : null
            }`}
          >
            Orders
          </button>
          <button
            onClick={displayReviews}
            className={`text-xl font-heading transition-all duration-500 hover:text-green-500 underline ${
              showReviews ? "text-green-500" : null
            }`}
          >
            Reviews
          </button>
          <button
            onClick={displaySettings}
            className={`text-xl font-heading transition-all duration-500 hover:text-green-500 underline ${
              showSettings ? "text-green-500" : null
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      <div>
        {showOrders && (
          <div className="mt-32">
            <form className="fixed top-[96px] z-10 left-0 p-1 bg-green-200 rounded-br-md">
              <label htmlFor="sort" className="font-heading text-xl px-2">
                Status:
              </label>
              <select
                name="sort"
                id="sort"
                value={sort}
                onChange={updateSort}
                className="border-2 border-green-200 rounded-sm"
              >
                <option value="paid">paid</option>
                <option value="pending">pending</option>
                <option value="cancelled">cancelled</option>
              </select>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {user_orders.filter((order) => order.status === sort).length >
                1 &&
                user_orders
                  .filter((order) => order.status === sort)
                  .sort((a, b) => {
                    a.updatedAt = getTime(a.updatedAt);
                    b.updatedAt = getTime(b.updatedAt);
                    return b.updatedAt - a.updatedAt;
                  })
                  .map((order, index) => (
                    <OrderItem
                      key={index}
                      {...order}
                      setLoading={setLoading}
                      value={sort}
                    ></OrderItem>
                  ))}
            </div>
            {user_orders.filter((order) => order.status === sort).length <
              1 && (
              <p className="text-center mt-2">
                You currently have no <span className="italic">{sort}</span>{" "}
                orders
              </p>
            )}
          </div>
        )}
        {showReviews && (
          <div className="mt-28">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {user_reviews.length > 0 &&
                user_reviews
                  .sort((a, b) => {
                    a.updatedAt = getTime(a.updatedAt);
                    b.updatedAt = getTime(b.updatedAt);
                    return b.updatedAt - a.updatedAt;
                  })
                  .map((review, index) => (
                    <ReviewItem
                      key={index}
                      {...review}
                      setLoading={setLoading}
                    ></ReviewItem>
                  ))}
            </div>
            {user_reviews.length < 1 && (
              <p className="text-center mt-2">You currently have no reviews</p>
            )}
          </div>
        )}
        {showSettings && <Settings />}
      </div>
    </div>
  );
};

export default AccountPortal;
