import * as React from "react";
function SearchInput() {
  return (
    <div className="flex gap-0 items-start self-start px-12 pt-3.5 pb-2 mt-2 text-4xl text-black whitespace-nowrap bg-zinc-300 rounded-[30px] max-md:flex-wrap max-md:px-5">
      {" "}
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5da1f680c494518d6e364d4b65b23ee3238062533de1f3b5f767c3413bee1c3b?apiKey=197ed2f85c0b44aeb76b1a94e8e2204c&"
        alt="Search icon"
        className="shrink-0 self-start w-12 aspect-[1.11]"
      />{" "}
      <input
        type="text"
        placeholder="Search..."
        className="flex-auto my-auto bg-transparent outline-none max-md:max-w-full"
      />{" "}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="justify-center items-end px-16 py-9 text-4xl text-white bg-indigo-400 rounded-[30px] max-md:px-5"
    >
      {" "}
      {children}{" "}
    </button>
  );
}
function Card({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="justify-center items-center px-16 pt-24 pb-20 rounded-3xl bg-zinc-300 max-md:px-5 max-md:max-w-full max-md:text-4xl"
    >
      {" "}
      {children}{" "}
    </button>
  );
}
function MyComponent() {
  const handleAddDomain = () => {
    console.log("Add Domain clicked");
  };
  const handleCardClick = (cardName) => {
    console.log(`${cardName} card clicked`);
  };
  return (
    <div className="flex flex-col items-center pb-20 bg-white">
      {" "}
      <header className="flex gap-5 self-stretch pr-3 pl-20 w-full whitespace-nowrap bg-zinc-300 max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
        {" "}
        <h1 className="my-auto text-4xl text-black">Admin</h1>{" "}
        <div className="flex gap-3 bg-zinc-300 rounded-[30px]">
          {" "}
          <div className="justify-center items-end px-9 py-7 text-5xl text-white bg-red-900 rounded-full max-md:px-5 max-md:text-4xl">
            {" "}
            P{" "}
          </div>{" "}
          <div className="flex-auto self-end mt-12 text-2xl text-black max-md:mt-10">
            premkumar
          </div>{" "}
        </div>{" "}
      </header>{" "}
      <main>
        {" "}
        <section className="flex gap-5 justify-between mt-6 w-full max-w-[1781px] max-md:flex-wrap max-md:max-w-full">
          {" "}
          <SearchInput /> <Button onClick={handleAddDomain}>
            Add Domain
          </Button>{" "}
        </section>{" "}
        <section className="flex gap-5 justify-between items-start mt-8 w-full text-7xl text-black whitespace-nowrap max-w-[1386px] max-md:flex-wrap max-md:max-w-full max-md:text-4xl">
          {" "}
          <Card onClick={() => handleCardClick("T&p")}>T&p</Card>{" "}
          <Card onClick={() => handleCardClick("PS")}>PS</Card>{" "}
        </section>{" "}
        <section className="flex gap-5 justify-between mt-36 w-full text-7xl text-black whitespace-nowrap max-w-[1386px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full max-md:text-4xl">
          {" "}
          <Card onClick={() => handleCardClick("IQAC")}>IQAC</Card>{" "}
          <Card onClick={() => handleCardClick("SD")}>SD</Card>{" "}
        </section>{" "}
      </main>{" "}
    </div>
  );
}
export default MyComponent