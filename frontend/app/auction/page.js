"use client";

export default function create() {
  const [contractAddress, setContractAddress] = useState("");

  const handleCallback = (contractAddress) => {
    setContractAddress(contractAddress);
  };

  

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24`}
    >
        
    </main>
  );
}
