"use client";

export function ItemCard({ item }) {
  return (
    <div className="card bordered shadow-lg w-72">
      <div className="card-body">
        <h2 className="card-title">{item.name}</h2>
        <p className="text-gray-700 text-sm">{item.description}</p>
        <div className="card-actions">
          <input
            type="number"
            className="input input-bordered w-1/2 max-w-xs"
            placeholder="0"
          ></input>
          <button className="btn btn-secondary">Bid</button>
        </div>
      </div>
    </div>
  );
}
