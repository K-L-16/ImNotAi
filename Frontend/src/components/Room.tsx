import React, { useEffect, useState } from 'react';
import { useClient } from '../stores/useClient';
import { useGameStatus } from '../stores/useGameStatus';
import { useRoundStatus } from '../stores/useRoundStatus';
import { usePlayer } from '../stores/usePlayer';
import { useMessage } from '../stores/useMessage';
import { useMessages } from '../stores/useMessages';
import { useVoteResult } from '../stores/useVoteResult';
import { useNavigate } from 'react-router';
import {
  subscribeToGameState,
  subscribeToRoundStatus,
  subscribeToTerminate,
  subscribeToVoteResult
} from '../utils/subscribes';
import { useTerminateStatus } from '../stores/useTerminateStatus';
import { alertDisconnect } from '../utils/alertDisconnect';

// const messages = [
//   { playerID: '1', text: 'abcdefghijklmnopqrstuvwxyzabcd' },
//   { playerID: '2', text: 'bbb' },
//   { playerID: '3', text: 'ccc' },
//   { playerID: '4', text: 'ddd' },
//   { playerID: '5', text: 'eee' }
// ];
const MessageOutput = () => {
  const { roundStatus } = useRoundStatus();
  const messages = roundStatus.messages;
  const { visibleMessages, addVisibleMessage, resetVisibleMessage } =
    useMessages();
  const { gameStatus } = useGameStatus();
  useEffect(() => {
    resetVisibleMessage();
    useGameStatus.getState().setStatus('VOTING');
  }, []);
  useEffect(() => {
    if (useGameStatus.getState().gameStatus.status == 'VOTING') {
      let idx = 0;
      const timer = setInterval(() => {
        addVisibleMessage(messages[idx]);
        idx++;
        if (idx >= messages.length) {
          clearInterval(timer);
        }
      }, 1500);
      return () => {
        clearInterval(timer);
      };
    }
  }, [useGameStatus.getState().gameStatus.status]);
  let playerNum = 0;
  return (
    <div className="flex bg-linear-to-br from-gray-300 to-gray-100 w-1/2 h-60 p-4 rounded-xl text-center align-center mx-auto mt-40 shadow-[8px_8px_16px_gray]">
      <div className="h-fit w-full text-left">
        {gameStatus.status == 'VOTING'
          ? visibleMessages.map(message => {
              playerNum++;
              return (
                <div
                  key={playerNum}
                  className="w-full my-2 px-2 py-1 rounded-xl bg-linear-to-r from-white to-80% to-gray-300 cursor-default hover:scale-107 duration-400">
                  anonymous {playerNum}: {message.text}
                </div>
              );
            })
          : 'no messages yet...'}
      </div>
    </div>
  );
};

const MessageInput = () => {
  const {} = useClient();
  const {} = usePlayer();
  const [canSubmit, setCanSubmit] = useState(true);
  const { setMessage } = useMessage();
  const playerID = usePlayer.getState().player.playerID;
  const handleChange = (message: string) => {
    setMessage({ playerID: playerID, text: message });
  };
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setCanSubmit(false);
    useClient.getState().client!.publish({
      destination: `app/room/${useGameStatus.getState().gameStatus.roomCode}/round-messages`,
      body: JSON.stringify({
        type: 'SUBMIT_MESSAGE',
        playerID,
        payload: { message: useMessage.getState().message }
      })
    });
  };
  useEffect(() => {
    usePlayer.getState().beElliminated();
    if (usePlayer.getState().eliminated) {
      setCanSubmit(false);
    }
  }, []);
  return (
    <>
      {canSubmit && (
        <form onSubmit={handleSubmit} className="flex flex-wrap justify-center">
          <input
            type="text"
            id="messageInput"
            placeholder="please enter your message here:"
            maxLength={30}
            className="mt-5 w-5/6 text-center rounded-3xl py-1 border-green-500 border-3 focus:bg-gray-100 focus:outline-none focus:shadow-[8px_8px_16px_white] focus:translate-y-1 shadow-[8px_8px_16px_gray] font-mono duration-300"
            onChange={ev => handleChange(ev.target.value)}></input>
          <div className="w-screen mt-3 text-center font-mono">
            note that you can enter up to 30 letters
          </div>
          <button
            type="submit"
            className="mt-3 rounded-2xl px-3 py-2 bg-linear-to-br from-green-600 to-green-500 text-white cursor-pointer shadow-[8px_8px_16px_gray] hover:scale-110 hover:bg-green-400 active:shadow-[8px_8px_16px_white] active:translate-y-1 duration-300">
            Submit and... prove you are not AI
          </button>
        </form>
      )}
      {usePlayer.getState().eliminated && <div>You have been ELIMINATED!</div>}
      {!canSubmit && <div>Waiting for others to prove they are not AI...</div>}
    </>
  );
};

const VoteInput = () => {
  const {} = usePlayer();
  const {} = useRoundStatus();
  const {} = useClient();
  const {} = useGameStatus();
  // test code
  // useEffect(() => {
  //   usePlayer.getState().createPlayer('2', false);
  //   useRoundStatus.getState().setMessages([
  //     { playerID: '1', text: 'aaa' },
  //     { playerID: '2', text: 'bbb' },
  //     { playerID: '3', text: 'ccc' },
  //     { playerID: '4', text: 'ddd' },
  //     { playerID: '5', text: 'eee' }
  //   ]);
  // }, []);
  let playerNum = 0;
  const handleClick = (targetID: string) => {
    useClient.getState().client!.publish({
      destination: `app/room/${useGameStatus.getState().gameStatus.roomCode}/action`,
      body: JSON.stringify({
        type: 'SUBMIT_VOTE',
        playerId: usePlayer.getState().player.playerID,
        payload: { targetId: targetID }
      })
    });
  };
  const voteButtons = useRoundStatus
    .getState()
    .roundStatus.messages.map(message => {
      playerNum++;
      return message.playerID == usePlayer.getState().player.playerID ? null : (
        <button
          key={playerNum}
          className="mx-auto mt-5 px-3 py-2 rounded-2xl bg-linear-to-br from-green-700 to-green-400 shadow-[8px_8px_16px_gray] cursor-pointer hover:scale-110 hover:from-red-700 hover:to-red-400 active:translate-y-1 active:shadow-[8px_8px_16px_white] duration-300"
          onClick={() => handleClick(message.playerID)}>
          anonymous player {playerNum}
        </button>
      );
    });
  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-screen text-center mt-5 font-mono">
        {' '}
        Please choose from below: who do you think is the AI?
      </div>
      {voteButtons}
    </div>
  );
};

const VoteOutput = () => {
  const { voteResult } = useVoteResult();
  const { player } = usePlayer();
  const { gameStatus } = useGameStatus();
  const elimatedID = voteResult.elimatedID;
  const tie = voteResult.tie;
  const playerID = usePlayer.getState().player.playerID;
  // let tie;
  // let playerID;
  // useEffect(() => {
  //   tie = true;
  //   playerID = player.playerID;
  //   useGameStatus.getState().setStatus('ENDED');
  // }, []);
  const { disconnect, unsubscribeAll } = useClient();
  const navigate = useNavigate();
  const handleClick = () => {
    unsubscribeAll();
    disconnect();
    navigate('/');
  };
  const status = useGameStatus.getState().gameStatus.status;
  if (
    useVoteResult.getState().voteResult.elimatedID ==
    usePlayer.getState().player.playerID
  ) {
    usePlayer.getState().beElliminated();
  }
  return (
    <div className="flex flex-wrap">
      <p className="w-screen mt-3 text-center font-mono">
        Last round{' '}
        {tie
          ? 'was a tie, no on gets voted out'
          : elimatedID == playerID
            ? 'YOU'
            : `player with ID ${elimatedID}`}{' '}
        got voted out!
      </p>
      {status == 'ENDED' ? (
        elimatedID.charAt(0) == 'p' ? (
          <p className="w-screen mt-2 text-center font-mono">and AI WINS!!!</p>
        ) : (
          <p className="w-screen mt-2 text-center font-mono">
            and HUMAN WINS!!!
          </p>
        )
      ) : null}
      {status == 'ENDED' && (
        <button
          onClick={handleClick}
          className="mx-auto rounded-2xl px-3 py-2 bg-linear-to-br from-red-600 to-red-400 shadow-[8px_8px_16px_gray] text-white cursor-pointer hover:scale-110 active:shadow-[8px_8px_16px_white] active:translate-y-1 duration-300">
          Home
        </button>
      )}
    </div>
  );
};

export const RoomPage = () => {
  const { gameStatus } = useGameStatus();
  const { unsubscribeAll, disconnect } = useClient();
  const {} = useTerminateStatus();
  useEffect(() => {
    // listen to game status change
    subscribeToGameState();
    // listen to terminate status
    subscribeToTerminate();
    // listen to round status change
    subscribeToRoundStatus();
    // listen to vote result
    subscribeToVoteResult();
    return () => {
      unsubscribeAll();
      disconnect();
    };
  }, []);
  useEffect(() => {
    if (
      useGameStatus.getState().gameStatus.status == 'ENDED' &&
      useTerminateStatus.getState().terminateStatus.reason ==
        'PLAYER_DISCONNECTED'
    ) {
      unsubscribeAll();
      disconnect();
      alertDisconnect(useTerminateStatus.getState().terminateStatus.playerID);
    }
  }, [useGameStatus.getState().gameStatus.status]);
  return (
    <>
      <MessageOutput />
      {gameStatus.status == 'VOTING' ? <VoteInput /> : null}
      {gameStatus.status == 'SPEAKING' ? <MessageInput /> : null}
      {gameStatus.status == 'SPEAKING' &&
      useVoteResult.getState().voteResult.voteRound != 1 ? (
        <VoteOutput />
      ) : null}
    </>
  );
};
