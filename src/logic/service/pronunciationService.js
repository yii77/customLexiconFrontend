import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let currentSound = null;

export const playYoudaoPronunciation = (word, type = 'uk') => {
  if (!word) return;

  // 停止上一次播放
  if (currentSound) {
    try {
      currentSound.stop();
      currentSound.release();
    } catch (e) {}
    currentSound = null;
  }

  const audioType = type === 'us' ? 2 : 1;
  const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
    word,
  )}&type=${audioType}`;

  const sound = new Sound(url, null, error => {
    if (error) return;

    if (currentSound !== sound) {
      sound.release();
      return;
    }

    sound.play(() => {
      sound.release();
      if (currentSound === sound) currentSound = null;
    });
  });

  currentSound = sound;
};
