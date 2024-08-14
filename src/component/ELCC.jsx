import React from "react";
const InternCard = ({ id, name, email, phone }) => {
  return (
    <div className="flex flex-col md:flex-row gap-5 items-center py-4 px-4 w-full bg-white rounded-3xl">
      {" "}
      <div className="text-2xl md:text-4xl">{id}.</div>{" "}
      <div className="flex gap-3 items-center">
        {" "}
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 text-2xl md:text-4xl rounded-full bg-zinc-300">
          {" "}
          {name[0].toUpperCase()}{" "}
        </div>{" "}
        <div className="text-xl md:text-3xl">{name}</div>{" "}
      </div>{" "}
      <div className="flex flex-col md:flex-row gap-2 md:gap-5 text-lg md:text-3xl">
        {" "}
        <div>Id-33810</div> <div>{email}</div> <div>Phone no:{phone}</div>{" "}
      </div>{" "}
    </div>
  );
};
const MyComponent = () => {
  const interns = [
    {
      id: 1,
      name: "premkumar",
      email: "premkumar.cb22@bitsathy.ac.in",
      phone: "9360710637",
    },
    {
      id: 2,
      name: "premkumar",
      email: "premkumar.cb22@bitsathy.ac.in",
      phone: "9360710637",
    },
    {
      id: 3,
      name: "premkumar",
      email: "premkumar.cb22@bitsathy.ac.in",
      phone: "9360710637",
    },
    {
      id: 4,
      name: "premkumar",
      email: "premkumar.cb22@bitsathy.ac.in",
      phone: "9360710637",
    },
    {
      id: 5,
      name: "premkumar",
      email: "premkumar.cb22@bitsathy.ac.in",
      phone: "9360710637",
    },
    {
      id: 6,
      name: "premkumar",
      email: "premkumar.cb22@bitsathy.ac.in",
      phone: "9360710637",
    },
  ];
  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {" "}
      <header className="flex justify-center items-center w-full px-4 py-4 md:px-16 md:py-7 text-2xl md:text-4xl text-black bg-zinc-300">
        {" "}
        ELCC{" "}
      </header>{" "}
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center w-full max-w-7xl px-4 py-8">
        {" "}
        <div className="flex gap-2 items-center px-4 py-2 md:px-12 md:py-3.5 text-lg md:text-4xl text-black bg-zinc-300 rounded-full">
          {" "}
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5da1f680c494518d6e364d4b65b23ee3238062533de1f3b5f767c3413bee1c3b?apiKey=bf50c4abb5ed47cc80242cff12c28d05&"
            alt="Search icon"
            className="w-6 h-6 md:w-12 md:h-12"
          />{" "}
          <span>search</span>{" "}
        </div>{" "}
        <button className="flex gap-2 items-center px-4 py-3 md:px-8 md:py-6 text-lg md:text-4xl text-white bg-indigo-400 rounded-full">
          {" "}
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/adab83a67c09874b9d5e1fa844157765a9133bc6f30b232dbd94bbbc4f78b115?apiKey=bf50c4abb5ed47cc80242cff12c28d05&"
            alt="Add intern icon"
            className="w-6 h-6 md:w-[67px] md:h-[67px]"
          />{" "}
          <span>Add Intern</span>{" "}
        </button>{" "}
      </div>{" "}
      <main className="flex flex-col gap-4 w-full max-w-7xl px-4 py-8 md:px-6 md:py-11 mt-8 md:mt-12 text-black bg-zinc-300 rounded-3xl">
        {" "}
        {interns.map((intern) => (
          <InternCard
            key={intern.id}
            id={intern.id}
            name={intern.name}
            email={intern.email}
            phone={intern.phone}
          />
        ))}{" "}
      </main>{" "}
    </div>
  );
};
export default MyComponent;
