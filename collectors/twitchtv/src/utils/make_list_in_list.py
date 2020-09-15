def make_list_in_list(lst, length_limit):
    '''
    :lst: Array  
    :length_limit: unit number for each divide
    '''
    return [lst[i * length_limit: (i + 1) * length_limit]
            for i in range((len(lst) + length_limit - 1) // length_limit)]
