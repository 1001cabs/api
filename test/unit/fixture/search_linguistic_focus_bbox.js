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
                    },
                    'boost': 5
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
                  'geo_bounding_box': {
                    'type': 'indexed',
                    'center_point': {
                      'top': 11.51,
                      'right': -61.84,
                      'bottom': 47.47,
                      'left': -103.16
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
          'weight': 1,
          'exp': {
            'center_point': {
              'origin': {
                'lat': 29.49136,
                'lon': -82.50622
              },
              'offset': '0km',
              'scale': '50km',
              'decay': 0.5
            }
          }
        },
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
    '_score',
    {
      '_geo_distance': {
        'order': 'asc',
        'distance_type': 'plane',
        'center_point': {
        'lat': 29.49136,
        'lon': -82.50622
        }
      }
    }
  ],
  'size': 10,
  'track_scores': true
};
