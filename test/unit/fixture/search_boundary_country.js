module.exports = {
  'query': {
    'function_score': {
      'query': {
        'filtered': {
          'query': {
            'bool': {
              'should': [
                {
                  'bool': {
                    '_name': 'fallback.street',
                    'boost': 5,
                    'must': [
                      {
						'fuzzy': {
						  'address_parts.street': {
						  'value': 'street value',
						  'boost' :         1,
						  'fuzziness' :     'AUTO',
						  'prefix_length' : 3,
						  'max_expansions': 10
						  }
						}
					  }
                    ],
                    'should': [],
                    'filter': {
                      'term': {
                        'layer': 'street'
                      }
                    }
                  }
                },
				{
                  'bool': {
                    '_name': 'fallback.streetaddress',
                    'must': [
                      {
						'query': {
						  'wildcard': {
							'address_parts.number': '*'
						  }
						}
					  },
					  {
						'fuzzy': {
						  'address_parts.street': {
						  'value': 'street value',
						  'boost' :         1,
						  'fuzziness' :     'AUTO',
						  'prefix_length' : 3,
						  'max_expansions': 10
						  }
						}
					  }
                    ],
                    'should': [],
                    'filter': {
                      'term': {
                        'layer': 'address'
                      }
                    },
                    'boost': 5
                  }
                }
              ]
            }
          },
          'filter': {
            'bool': {
              'must': [
                {
                  'match': {
                    'parent.country_a': {
                      'analyzer': 'standard',
                      'query': 'ABC'
                    }
                  }
                },
                {
                  'terms': {
                    'layer': [
                      'test'
                    ]
                  }
                }
              ]
            }
          }
        }
      },
      'max_boost': 20,
      'functions': [
        {
          'field_value_factor': {
            'modifier': 'log1p',
            'field': 'popularity',
            'missing': 1
          },
          'weight': 1
        },
        {
          'field_value_factor': {
            'modifier': 'log1p',
            'field': 'population',
            'missing': 1
          },
          'weight': 2
        }
      ],
      'score_mode': 'avg',
      'boost_mode': 'multiply'
    }
  },
  'sort': [
    '_score'
  ],
  'size': 10,
  'track_scores': true
};
