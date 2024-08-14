import * as React from "react";

function InternDetail() {
  const internData = {
    name: "",
    id: "",
    email: "",
    domain: "",
    branchAndDegree: "",
  };

  return (
    <div className="flex flex-col pb-9 bg-white">
      <header className="justify-center items-center px-16 py-8 w-full text-4xl text-black bg-zinc-300 max-md:px-5 max-md:max-w-full">
        Intern Detail
      </header>
      <div className="flex gap-5 justify-between self-end mt-10 mr-20 max-w-full text-4xl whitespace-nowrap w-[419px] max-md:mt-10 max-md:mr-2.5">
        <button className="justify-center items-end px-16 py-6 bg-sky-300 rounded-3xl text-zinc-50 max-md:px-5">
          edit
        </button>
        <button className="justify-center items-end px-16 py-6 text-white bg-red-600 rounded-3xl max-md:pl-5">
          Delete
        </button>
      </div>
      <main className="flex flex-col items-center self-center py-10 pr-8 pl-20 mt-20 w-full rounded-3xl bg-zinc-300 max-w-[1750px] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-5 justify-between w-full max-w-[1563px] max-md:flex-wrap max-md:max-w-full">
          <div className="flex flex-col my-auto text-4xl text-black whitespace-nowrap">
            <label htmlFor="name">Name*</label>
            <label htmlFor="id" className="mt-24 max-md:mt-10">
              Id*
            </label>
            <label htmlFor="email" className="mt-20 max-md:mt-10">
              Email*
            </label>
            <label htmlFor="domain" className="mt-24 max-md:mt-10">
              Domain*
            </label>
          </div>
          <div className="flex flex-col max-md:max-w-full">
            <input
              type="text"
              id="name"
              className="shrink-0 rounded-3xl bg-zinc-50 h-[109px] max-md:max-w-full"
              value={internData.name}
              readOnly
            />
            <input
              type="text"
              id="id"
              className="shrink-0 mt-4 rounded-3xl bg-zinc-50 h-[109px] max-md:max-w-full"
              value={internData.id}
              readOnly
            />
            <input
              type="email"
              id="email"
              className="shrink-0 mt-3.5 rounded-3xl bg-zinc-50 h-[109px] max-md:max-w-full"
              value={internData.email}
              readOnly
            />
            <input
              type="text"
              id="domain"
              className="shrink-0 mt-3.5 rounded-3xl bg-zinc-50 h-[109px] max-md:max-w-full"
              value={internData.domain}
              readOnly
            />
          </div>
        </div>
        <div className="mt-3.5 w-full max-w-[1563px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
              <label htmlFor="branchAndDegree" className="self-stretch my-auto text-4xl text-black max-md:mt-10">
                Branch And Degree*
              </label>
            </div>
            <div className="flex flex-col ml-5 w-9/12 max-md:ml-0 max-md:w-full">
              <input
                type="text"
                id="branchAndDegree"
                className="shrink-0 mx-auto max-w-full rounded-3xl bg-zinc-50 h-[109px] w-[1126px] max-md:mt-10"
                value={internData.branchAndDegree}
                readOnly
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InternDetail;