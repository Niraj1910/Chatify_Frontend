import catLogo from "../../public/cat.jpg";

const Hero = () => {
  const arr = [
    {
      title: "Connect with Ease",
      para: "Start conversations with friends in real-time on Chatify.",
      img: null,
    },
    {
      title: "Start chatting instantly",
      para: "Chatify allows you to start chatting instantly with friends. No more waiting, just jump right into the conversation",
      img: null,
    },
    {
      title: "Stay connected in one place",
      para: "With Chatify, you can stay connected with all your friends in one place. No need to switch between multiple apps.",
      img: null,
    },
    {
      title: "Real-time conversations",
      para: "Experience real-time conversations with your friends on Chatify. Stay updated and engaged with instant messaging.",
      img: null,
    },
  ];

  return (
    <section className="w-[70%] m-auto flex flex-col gap-8 mt-20">
      <p className="text-white flex flex-col gap-8 text-center">
        <h1 className="text-4xl font-bold">Connect with Ease</h1>
        <h4 className="text-xl font-semibold">
          Start conversations with friends in real-time on Chatify.
        </h4>
      </p>
      {arr.map((item, index) => (
        <div key={index} className="flex justify-between items-center ">
          {index % 2 !== 0 && (
            <img src={catLogo} alt="img" className="rounded-2xl w-96" />
          )}

          <p className="text-white flex flex-col gap-8">
            <h1 className="text-4xl font-bold">{item.title}</h1>
            <h4 className="text-xl font-semibold">{item.para}</h4>
          </p>
          {index % 2 === 0 && (
            <img src={catLogo} alt="img" className="rounded-2xl w-96" />
          )}
        </div>
      ))}

      {[1, 2, 3, 4]}
    </section>
  );
};

export default Hero;
