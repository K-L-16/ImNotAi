const MessageOutput = () => {
  return (
    <>
      <div>messages would be displayed here</div>
    </>
  );
};

const MessageInput = () => {
  return (
    <>
      <input type="text" placeholder="please enter your text here:"></input>
      <p>note that you can enter up to 40 letters</p>
    </>
  );
};

export const RoomPage = () => {
  return (
    <>
      <MessageOutput />
      <MessageInput />
    </>
  );
};
