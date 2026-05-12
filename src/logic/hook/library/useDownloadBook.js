import { useContext, useCallback } from 'react';

import { CommonActions, useNavigation } from '@react-navigation/native';

import { fetchWordsByBookId } from '../../../data/api';

import {
  getBookById,
  insertBook,
  insertUnitBookMappings,
  insertWordBookMappings,
  insertWordPracticeStatus,
} from '../../../data/local/dao';

import { PracticeBookContext } from '../../context/PracticeBookContext';

import {
  useCustomAlert,
  useToast,
} from '../../../presentation/component/system';

export function useDownloadBook() {
  const navigation = useNavigation();

  const { practiceBook, savePracticeBook } = useContext(PracticeBookContext);

  const { showAlert, hideAlert } = useCustomAlert();
  const { showToast } = useToast();

  const goPracticeHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'HomeScreen',
            params: { reloadAt: Date.now() },
          },
        ],
      }),
    );
  }, [navigation]);

  const handlePrepareDownload = useCallback(
    async book => {
      try {
        const isDownloaded = book.owner === 'system' && !!book.created_at;

        if (book._id === practiceBook?._id && isDownloaded) {
          navigation.replace('PracticeStack');
          return;
        }

        if (isDownloaded) {
          await savePracticeBook(book);
          navigation.replace('PracticeStack');
          return;
        }

        if (book._id === practiceBook?._id) {
          showAlert({
            title: '提示',
            content:
              '该词书为在学词书，是否重新下载？该操作不会影响学习状态，只还原单词与单元顺序',
            buttons: [
              { text: '取消', onPress: hideAlert },
              {
                text: '确定',
                onPress: () => {
                  hideAlert();
                  downloadBook(book);
                },
              },
            ],
            type: 'center',
          });
          return;
        }

        const exist = await getBookById(book._id);

        if (exist) {
          showAlert({
            title: '提示',
            content:
              '已有该词书，是否重新下载？该操作不会影响学习状态，只还原单词与单元顺序',
            buttons: [
              { text: '取消', onPress: hideAlert },
              {
                text: '确定',
                onPress: () => {
                  hideAlert();
                  downloadBook(book);
                },
              },
            ],
            type: 'center',
          });
          return;
        }
        await downloadBook(book);
      } catch (error) {
        console.log(error);
      }
    },
    [practiceBook, downloadBook],
  );

  const downloadBook = useCallback(async book => {
    try {
      const controller = new AbortController();

      showAlert({
        title: '下载词书',
        content: '正在处理词书，请稍后',
        buttons: [
          {
            text: '取消',
            onPress: () => {
              controller.abort();
              hideAlert();
            },
          },
        ],
        type: 'center',
      });

      const remoteRes = await fetchWordsByBookId(book._id, controller.signal);

      if (remoteRes.aborted) return;

      if (remoteRes.success) {
        await Promise.all([
          insertBook(book),
          savePracticeBook(book),
          insertUnitBookMappings(remoteRes.data.units),
          insertWordBookMappings(remoteRes.data.words),
          insertWordPracticeStatus(remoteRes.data.words),
        ]);
        goPracticeHome();
      }
    } catch (error) {
      console.log(error);
      if (error.status) {
        showToast({
          message: `下载词书失败，错误码：${error.status}`,
          type: 'error',
        });
      }
    } finally {
      hideAlert();
    }
  }, []);

  return { handlePrepareDownload };
}
