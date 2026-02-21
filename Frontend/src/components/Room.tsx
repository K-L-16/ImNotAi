import React, { useEffect, useState } from 'react';
import { useClient } from '../stores/useClient';
import { useGameStatus } from '../stores/useGameStatus';
import { useRoundStatus } from '../stores/useRoundStatus';
import { usePlayer } from '../stores/usePlayer';
import { useMessage } from '../stores/useMessage';
import { useMessages } from '../stores/useMessages';
import { useVoteResult } from '../stores/useVoteResult';
import type { VoteCount } from '../types/VoteCount';
import { useNavigate } from 'react-router';

const MessageOutput = () => {
  const { roundStatus } = useRoundStatus();
  const messages = roundStatus.messages;
  const { visibleMessages, addVisibleMessage, resetVisibleMessage } =
    useMessages();
  useEffect(() => {
    resetVisibleMessage();
  }, []);
  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      addVisibleMessage(messages[idx]);
      idx++;
      if (idx >= messages.length) {
        clearInterval(timer);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [messages]);
  return (
    <>
      <div>
        {messages.length == 0
          ? 'no messages yet...'
          : visibleMessages.map((message, index) => (
              <div key={index}>
                anonymous player {index + 1}: {message.text}
              </div>
            ))}
      </div>
    </>
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
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="please enter your text here:"
        maxLength={30}
        onChange={ev => handleChange(ev.target.value)}></input>
      <p>note that you can enter up to 30 letters</p>
      {canSubmit && (
        <button type="submit">Submit and... prove you are not AI</button>
      )}
      {!canSubmit && <div>Waiting for others to prove they are not AI...</div>}
    </form>
  );
};

const VoteInput = () => {
  const {} = usePlayer();
  const {} = useRoundStatus();
  const {} = useClient();
  const {} = useGameStatus();
  // test code
  //   useEffect(() => {
  //     usePlayer.getState().createPlayer('2', false);
  //     useRoundStatus.getState().setMessages([
  //       { playerID: '1', text: 'aaa' },
  //       { playerID: '2', text: 'bbb' },
  //       { playerID: '3', text: 'ccc' },
  //       { playerID: '4', text: 'ddd' },
  //       { playerID: '5', text: 'eee' }
  //     ]);
  //   }, []);
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
        <button key={playerNum} onClick={() => handleClick(message.playerID)}>
          anonymous player {playerNum}
        </button>
      );
    });
  return <>{voteButtons}</>;
};

const VoteOutput = () => {
  const elimatedID = useVoteResult.getState().voteResult.elimatedID;
  const tie = useVoteResult.getState().voteResult.tie;
  const playerID = usePlayer.getState().player.playerID;
  const status = useGameStatus.getState().gameStatus.status;
  const { disconnect, unsubscribeAll } = useClient();
  const navigate = useNavigate();
  const handleClick = () => {
    unsubscribeAll();
    disconnect();
    navigate('/');
  };
  return (
    <>
      <p>
        Last round{' '}
        {tie
          ? 'was a tie, no on gets voted out'
          : elimatedID == playerID
            ? 'YOU'
            : `player with ID ${elimatedID}`}{' '}
      </p>
      {status == 'ENDED' && elimatedID.charAt(0) == 'p' ? (
        <p>and AI WINS!!!</p>
      ) : (
        <p>and HUMAN WINS!!!</p>
      )}
      {status == 'ENDED' && <button onClick={handleClick}>Home</button>}
    </>
  );
};

export const RoomPage = () => {
  const {
    gameStatus,
    setRoomCode,
    setStatus,
    setLocked,
    setRound,
    setPlayerCount,
    setMaxPlayers,
    setPremise
  } = useGameStatus();
  const { setRoundStatus, setMessages } = useRoundStatus();
  const { addSubscription, unsubscribeAll, disconnect } = useClient();
  const { setVoteRound, setVoteCount, setElimatedID, setTie, setReason } =
    useVoteResult();
  const roomCode = useGameStatus.getState().gameStatus.roomCode;
  useEffect(() => {
    // listen to game status change
    addSubscription(
      useClient
        .getState()
        .client!.subscribe(`/topic/room/${roomCode}/state`, msg => {
          const state = JSON.parse(msg.body);
          setRoomCode(state.roomCode);
          setStatus(state.status);
          setLocked(state.locked);
          setRound(state.round);
          setPlayerCount(state.PlayerCount);
          setMaxPlayers(state.maxPlayers);
          setPremise(state.premise);
        })
    );
    // listen to round status change
    addSubscription(
      useClient
        .getState()
        .client!.subscribe(`/topic/room/${roomCode}/round-message`, msg => {
          const state = JSON.parse(msg.body);
          setRoundStatus(state.round);
          setMessages(state.messages);
        })
    );
    // listen to vote result
    addSubscription(
      useClient
        .getState()
        .client!.subscribe(`/topic/room/${roomCode}/vote-result`, msg => {
          const state = JSON.parse(msg.body);
          setVoteRound(state.round);
          const voteCounts = Object.entries(state.voteCount).map(voteCount => {
            return { playerID: voteCount[0], count: voteCount[1] } as VoteCount;
          });
          setVoteCount(voteCounts);
          setElimatedID(state.elimatedId);
          setTie(state.tie);
          setReason(state.reason);
        })
    );
    return () => {
      unsubscribeAll();
      disconnect();
    };
  }, []);
  return (
    <>
      <MessageOutput />
      {gameStatus.status == 'VOTING' ? <VoteInput /> : null}
      {gameStatus.status == 'SPEAKING' ? <MessageInput /> : null}
      {gameStatus.status == 'SPEAKING' &&
      useVoteResult.getState().voteResult.voteRound != 0 ? (
        <VoteOutput />
      ) : null}
    </>
  );
};
