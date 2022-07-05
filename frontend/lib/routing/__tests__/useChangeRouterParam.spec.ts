import mockRouter from 'next-router-mock';
import { act, renderHook } from '@testing-library/react';
import singletonRouter from 'next/router';
import {
  upsertRouterPathQueryWithValue,
  useChangeRouterParam,
} from '../useChangeRouterParam';

jest.mock('next/router', () => require('next-router-mock'));

describe('useChangeRouterParam', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/initial');
  });
  it('pushes new url when called', () => {
    const { result } = renderHook(() => useChangeRouterParam('foo'));
    expect(singletonRouter.asPath).toBe('/initial');
    act(() => {
      result.current('bar');
    });
    expect(singletonRouter.asPath).toBe('/initial?foo=bar');
  });
});

describe('upsertRouterPathQueryWithValue', () => {
  it('replace router query string by path', () => {
    expect(
      upsertRouterPathQueryWithValue('/foo/bar?key=changeme', 'key', 'newvalue'),
    ).toBe('/foo/bar?key=newvalue');
  });
  it("create new query key if key doesn't exist", () => {
    expect(
      upsertRouterPathQueryWithValue('/foo/bar?key=value', 'newkey', 'newvalue'),
    ).toBe('/foo/bar?key=value&newkey=newvalue');
  });
  it('create query paths if not query string', () => {
    expect(
      upsertRouterPathQueryWithValue('/foo/bar', 'newkey', 'newvalue'),
    ).toBe('/foo/bar?newkey=newvalue');
  });
  it('keep order of keys', () => {
    expect(
      upsertRouterPathQueryWithValue(
        '/foo/bar?key1=value1&key2=value2&key3=value3',
        'key2',
        'newvalue2',
      ),
    ).toBe('/foo/bar?key1=value1&key2=newvalue2&key3=value3');
  });
});
