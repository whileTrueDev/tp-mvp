export default function makeGroupedData(datalist, targetProp = 'viewer') {
  function groupBy(list, keyGetter, targetProperty) {
    const map = new Map();

    list
      .forEach((item) => {
        const key = keyGetter(item);
        if (!map.has(key)) {
          map.set(key, {
            [item.platform]: { ...item, value: item[targetProperty] },
          });
        } else {
          const target = map.get(key)[item.platform];
          if (target) {
            if (target instanceof Array) {
            // 해당 플랫폼key에 이미 데이터가 여럿 들어와 array 인경우
              target.push({ ...item, value: item[targetProperty] });
              target.sort(
                (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
              );
            } else {
            // 해당 플랫폼에 데이터가 한개만 들어온 경우 -> array로 변환 + 데이터 추가
              map.set(key, {
                ...map.get(key),
                [item.platform]: [target, { ...item, value: item[targetProperty] }]
                  .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()),
              });
            }
          } else {
          // 해당 플랫폼의 첫 데이터인 경우
            map.set(key, {
              ...map.get(key),
              [item.platform]: { ...item, value: item[targetProperty] },
            });
          }
        }
      });
    return map;
  }
  const result = groupBy(
    datalist.map((d) => ({ ...d, startedDate: d.startedAt.split(' ')[0] })),
    (item) => item.startedDate,
    targetProp,
  );

  return Object.fromEntries(result);
}
