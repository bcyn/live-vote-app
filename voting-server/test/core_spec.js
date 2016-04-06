import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('a', 'b');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('a', 'b')
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['a', 'b'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('a', 'b')
      }));
    });

  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('a', 'b', 'c')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('a', 'b')
        }),
        entries: List.of('c')
      }));
    });

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('a', 'b'),
          tally: Map({
            'a': 4,
            'b': 2
          })
        }),
        entries: List.of('c', 'd', 'e')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('c', 'd'),
        }),
        entries: List.of('e', 'a')
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('a', 'b'),
          tally: Map({
            'a': 3,
            'b': 3
          })
        }),
        entries: List.of('c', 'd', 'e')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('c', 'd'),
        }),
        entries: List.of('e', 'a', 'b')
      }));
    });

    it('marks winner when just one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('a', 'b'),
          tally: Map({
            'a': 4,
            'b': 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'a'
      }));
    })

  });

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = fromJS({
        pair: ['a', 'b']
      });
      const nextState = vote(state, 'a');
      expect(nextState).to.equal(fromJS({
        pair: ['a', 'b'],
        tally: {a: 1}
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = fromJS({
        pair: ['a', 'b'],
        tally: {a: 3, b: 2}
      });
      const nextState = vote(state, 'a');
      expect(nextState).to.equal(fromJS({
        pair: ['a', 'b'],
        tally: {a: 4, b: 2}
      }));
    });

  });

});