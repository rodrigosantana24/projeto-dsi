import React, { useEffect, useState } from 'react';
import { Text } from 'react-native'; // IMPORTANTE!
import getNickName from '../services/getNickName';

export default function FriendNickName({ userId, amigoId, style }) {
  const [nick, setNick] = useState('');

  useEffect(() => {
    let isMounted = true;
    getNickName({ userId, amigoId }).then((result) => {
      if (isMounted) setNick(result || '');
    });
    return () => { isMounted = false; };
  }, [userId, amigoId]);

  return <Text style={style}>{nick}</Text>;
}

