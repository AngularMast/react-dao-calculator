import React from 'react';
import { render, cleanup, waitForElement } from '@testing-library/react';

import { NaviProvider } from 'react-navi';
import { mount, route, createMemoryNavigation } from 'navi';

import { ETH } from '@makerdao/dai';
import { ThemeProvider } from 'styled-components';
import theme from 'styles/theme';

import StoreProvider from '../../providers/StoreProvider';
import TestMakerProvider from '../../../test/helpers/TestMakerProvider';
import MobileNav from '../MobileNav';

afterEach(cleanup);

const ilk = 'ETH-A';
const cdpId = 1;

const initialState = {
  system: {
    globalDebtCeiling: '1000'
  },
  cdps: {
    [cdpId]: {
      ilk: ilk,
      ink: '2',
      art: '75'
    }
  },
  feeds: [
    {
      key: ilk,
      gem: 'ETH',
      rate: '1.5',
      feedValueUSD: ETH(100),
      currency: { symbol: 'ETH' }
    }
  ]
};

test('MobileNav button displays ilk label & liquidation ratio', async () => {
  const navigation = createMemoryNavigation({
    routes: mount({ '/test': route() }),
    url: `/${cdpId}`
  });
  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <NaviProvider navigation={navigation}>
        <StoreProvider reducer={() => initialState} initialState={initialState}>
          <TestMakerProvider waitForAuth={true}>
            <MobileNav cdpId={cdpId} />
          </TestMakerProvider>
        </StoreProvider>
      </NaviProvider>
    </ThemeProvider>
  );

  await waitForElement(() => getByText('maker-logo.svg'));

  getByText(ilk);
  getByText('178%');
});
