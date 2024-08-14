import * as React from "react";
function InternDetail() {
  const [internData, setInternData] = React.useState({
    name: "",
    id: "",
    email: "",
    domain: "",
    branchAndDegree: "",
  });
  function handleChange(field, value) {
    setInternData((prevData) => ({ ...prevData, [field]: value }));
  }
  return (
    <div className="flex flex-col pb-9 bg-white">
      {" "}
      <header className="justify-center items-center px-16 py-8 w-full text-4xl rounded-3xl text-black bg-zinc-300 max-md:px-5 max-md:max-w-full">
        {" "}
        Intern Detail{" "}
      </header>{" "}
      <main className="flex flex-col items-center self-center pt-5 pr-8 pb-11 pl-20 mt-6 w-full rounded-3xl bg-zinc-300 max-w-[1750px] max-md:px-5 max-md:max-w-full">
       
        <div className="w-full max-w-[1587px] max-md:max-w-full">
       
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
           
            <div className="flex flex-col w-[24%] max-md:ml-0 max-md:w-full">
            
              <div className="flex flex-col text-4xl text-black whitespace-nowrap max-md:mt-10">
                
                <button className="shrink-0 bg-white rounded-full h-[187px]" />
                <div className="flex flex-col px-8 mt-10 max-md:px-5 max-md:mt-10">
                 
                  <div>Name*</div> <div className="mt-24 max-md:mt-10">Id*</div>
                  <div className="mt-20 max-md:mt-10">Email*</div>
                  <div className="mt-24 max-md:mt-10">Domain*</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[76%] max-md:ml-0 max-md:w-full">
        
              <div className="flex flex-col grow mt-48 max-md:mt-10 max-md:max-w-full">
               
                <InputField
                  value={internData.name}
                  onChange={(value) => handleChange("name", value)}
                />{" "}
                <InputField
                  value={internData.id}
                  onChange={(value) => handleChange("id", value)}
                />{" "}
                <InputField
                  value={internData.email}
                  onChange={(value) => handleChange("email", value)}
                />{" "}
                <InputField
                  value={internData.domain}
                  onChange={(value) => handleChange("domain", value)}
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="mt-3.5 w-full max-w-[1587px] max-md:max-w-full">
          {" "}
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            {" "}
            <div className="flex flex-col w-[26%] max-md:ml-0 max-md:w-full">
              {" "}
              <div className="self-stretch my-auto text-4xl text-black max-md:mt-10">
                {" "}
                Branch And Degree*{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex flex-col ml-5 w-[74%] max-md:ml-0 max-md:w-full">
              {" "}
              <InputField
                value={internData.branchAndDegree}
                onChange={(value) => handleChange("branchAndDegree", value)}
                className="shrink-0 mx-auto max-w-full rounded-3xl bg-zinc-50 h-[109px] w-[1126px] max-md:mt-10"
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </main>{" "}
    </div>
  );
}
function InputField({ value, onChange, className = "" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`shrink-0 mt-4 rounded-3xl bg-zinc-50 h-[109px] max-md:max-w-full ${className}`}
    />
  );
}
export default InternDetail