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
					  },
                      {
                        'multi_match': {
                          'query': 'street value',
                          'type': 'phrase',
                          'fields': [
                            'parent.locality',
                            'parent.locality_a',
                            'parent.localadmin',
                            'parent.localadmin_a'
                          ]
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
                  'terms': {
                    'category': [
                      'retail',
                      'food'
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
  'size': 20,
  'track_scores': true,
  'sort': [
    '_score'
  ]
};
