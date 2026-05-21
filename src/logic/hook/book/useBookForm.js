import { useState, useEffect } from 'react';

import { useNavigation, useRoute } from '@react-navigation/native';

import {
  checkBookExists,
  deleteBook,
  getSubcategoryOptions,
  insertNotebook,
  insertWordBook,
  updateBook,
} from '../../../data/local/dao';

import {
  useCustomAlert,
  useToast,
} from '../../../presentation/component/system';

export function useBookForm() {
  const route = useRoute();
  const navigation = useNavigation();

  const { showAlert, hideAlert } = useCustomAlert();
  const { showToast } = useToast();

  const { category, editingBook } = route.params || null;

  const [subcategory, setSubcategory] = useState(
    editingBook?.subcategory ?? null,
  );
  const [bookName, setBookName] = useState(editingBook?.name ?? null);
  const [subcategoryOption, setSubcategoryOption] = useState(null);

  const isEdit = !!editingBook;
  const targetCategory = isEdit ? editingBook.category : category;

  useEffect(() => {
    const targetCategory = isEdit ? editingBook.category : category;

    if (!targetCategory) return;

    const load = async () => {
      const subs = await getSubcategoryOptions(targetCategory);
      setSubcategoryOption(subs);
    };

    load();
  }, []);

  const handleAddBook = async () => {
    if (!subcategory) {
      showAlert({
        title: '提示',
        content: '分类不能为空',
        buttons: [{ text: '确定', onPress: hideAlert }],
        type: 'center',
      });
      return;
    }

    if (!bookName) {
      showAlert({
        title: '提示',
        content: '书籍名称不能为空',
        buttons: [{ text: '确定', onPress: hideAlert }],
        type: 'center',
      });
      return;
    }

    const exist = await checkBookExists(bookName, targetCategory, subcategory);

    if (exist) {
      showAlert({
        title: '提示',
        content: `${targetCategory}下已有分类为${subcategory}的${bookName}词书，请更换名字`,
        buttons: [{ text: '确定', onPress: hideAlert }],
        type: 'center',
      });
      return;
    }

    try {
      if (isEdit) {
        await insertNotebook(bookName, subcategory);
      } else {
        await insertWordBook(bookName, subcategory);
      }

      navigation.goBack();
    } catch (error) {
      showToast({
        message: `新增${targetCategory}失败，${error}`,
        type: 'error',
      });
    }
  };

  const handleEditBook = async () => {
    if (!subcategory) {
      showAlert({
        title: '提示',
        content: '分类不能为空',
        buttons: [{ text: '确定', onPress: hideAlert }],
        type: 'center',
      });
      return;
    }

    if (!bookName) {
      showAlert({
        title: '提示',
        content: '书籍名称不能为空',
        buttons: [{ text: '确定', onPress: hideAlert }],
        type: 'center',
      });
      return;
    }

    if (
      subcategory === editingBook.subcategory &&
      bookName === editingBook.name
    ) {
      navigation.goBack();
      return;
    }

    const exist = await checkBookExists(bookName, targetCategory, subcategory);

    if (exist) {
      showAlert({
        title: '提示',
        content: `${targetCategory}下已有分类为${subcategory}的${bookName}词书，请更换名字`,
        buttons: [{ text: '确定', onPress: hideAlert }],
        type: 'center',
      });
      return;
    }
    try {
      await updateBook(editingBook.id, bookName, subcategory);
      navigation.goBack();
    } catch (error) {
      showToast({
        message: `编辑${targetCategory}失败，${error}`,
        type: 'error',
      });
    }
  };

  const handleDeleteBook = async () => {
    try {
      const prompt =
        editingBook?.category === '笔记本'
          ? `确定删除 "${editingBook.name}" 吗？该笔记本的所有笔记将被清空！`
          : `确定删除 "${editingBook.name}" 吗？`;

      showAlert({
        title: '提示',
        content: prompt,
        buttons: [
          { text: '取消', onPress: hideAlert },
          {
            text: '确定',
            onPress: async () => {
              await deleteBook(editingBook.id);
              hideAlert();
              navigation.goBack();
            },
          },
        ],
        type: 'center',
      });
    } catch (error) {
      console.log(error);
      showToast({
        message: `删除${targetCategory}失败，${error}`,
        type: 'error',
      });
    }
  };

  return {
    subcategory,
    bookName,
    subcategoryOption,
    setSubcategory,
    setBookName,
    isEdit,
    targetCategory,
    handleAddBook,
    handleEditBook,
    handleDeleteBook,
  };
}
