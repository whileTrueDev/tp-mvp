import json


def json_dumper(data, file_name, encoding='utf-8', _ascii=False, indent=4):
    '''
      json을 파일로 저장하는 함수
      data : 저장할 json 객체
      file_name : 저장될 파일 이름
      encoding : prefix utf8
      _ascii : prefix false
      indent : prefix 4
    '''
    with open('{file}.json'.format(file=file_name), 'w', encoding=encoding) as f:
        json.dump(data, f, ensure_ascii=_ascii, indent=indent)
