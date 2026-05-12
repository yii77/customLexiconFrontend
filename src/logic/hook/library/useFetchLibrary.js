import { useEffect, useState } from 'react';

import { fetchLibrary } from '../../../data/api';

import {
  getSystemBooks,
  getUserWordBooks,
} from '../../../data/local/repository';

import { useToast } from '../../../presentation/component/system';

export function useFetchLibrary() {
  const [library, setLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const loadWordbooks = async () => {
      try {
        const [remoteRes, systemBooks, userWordBooks] = await Promise.all([
          fetchLibrary(controller.signal),
          getSystemBooks(),
          getUserWordBooks(),
        ]);

        let remoteLibrary = [];

        if (remoteRes.success) {
          remoteLibrary = remoteRes.data;
        }

        setLibrary([...systemBooks, ...userWordBooks, ...remoteLibrary]);
      } catch (error) {
        console.log(error);
        if (error.name === 'AbortError') {
          return;
        }
        if (error.status) {
          showToast({
            message: `获取图书资源失败，错误码：${error.status}`,
            type: 'error',
          });
        }
      } finally {
        setLibraryLoading(false);
      }
    };

    loadWordbooks();

    return () => controller.abort();
  }, []);

  return { library, libraryLoading };
}
