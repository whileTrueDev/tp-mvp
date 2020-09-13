import re
from komoran3py.komoran3py import KomoranPy
from .warning_eliminator import ChainedAssignent

ko = KomoranPy()
ko.set_user_dictionary(('../user_dictionary.txt'))


def morphs_analyzer(word):
    '''
        dataframe에서 row별로 형태소 분석하는 함수 (apply lambda 사용)
    '''
    line_list = []
    for i in range(len(ko.pos(word))):
        line_list.append(ko.pos(word)[i][0])
    return line_list


def get_line_score(index, df):
    m = re.compile('ㅋ+')
    score = 0
    for line in df['anal'][index]:
        find = m.findall(str(line))
        word = ''.join(find)
        score += len(word)
    with ChainedAssignent():
        df['ㅋ'][index] = score


def word_counter(index, df):
    try:
        get_line_score(index, df)
        if '유하' in df['anal'][index]:
            df['유하'][index] = df['anal'][index].count('유하')
        if '?' in df['anal'][index]:
            # 물음표 하나만 ? 딱 쳤을 때
            if len(df['anal'][index]) == 1:
                df['?'][index] = 1
    except Exception as e:
        print(e)
        df['error'][index] = 1
