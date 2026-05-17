import { useState, useCallback, useMemo } from 'react';

export const useWordSection = (section = []) => {
  const [expandedMap, setExpandedMap] = useState({});

  const toggleSection = useCallback(key => {
    setExpandedMap(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const expandAllSection = useCallback(() => {
    const next = {};
    for (let i = 0; i < section.length; i++) {
      next[section[i].key] = true;
    }
    setExpandedMap(next);
  }, [section]);

  const collapseAllSection = useCallback(() => {
    setExpandedMap({});
  }, []);

  const baseSection = useMemo(() => {
    return section ?? [];
  }, [section]);

  const displaySection = useMemo(() => {
    return baseSection.map(s => {
      const isExpanded = !!expandedMap[s.key];

      return {
        key: s.key,
        title: s.title,
        data: s.data,
        isExpanded,
        count: s.data?.length ?? 0,
        displayData: isExpanded ? s.data : [],
      };
    });
  }, [baseSection, expandedMap]);

  return {
    displaySection,
    expandedMap,
    toggleSection,
    expandAllSection,
    collapseAllSection,
  };
};
