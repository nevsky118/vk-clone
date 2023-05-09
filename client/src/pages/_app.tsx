import '@/styles/globals.css';

import Head from 'next/head';
import { ReactElement, ReactNode } from 'react';
import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { Provider } from 'react-redux';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from '@/redux/store';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/authSlice';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/use-user';
import { ModalsProvider } from '@mantine/modals';

let persistor = persistStore(store);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
	auth?: boolean;
	roles?: string[];
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App(props: AppPropsWithLayout) {
	const { Component, pageProps } = props;

	const getLayout = Component.getLayout ?? (page => page);

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>

			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<ModalsProvider>
						{Component.auth ? (
							<Auth>{getLayout(<Component {...pageProps} />)}</Auth>
						) : (
							getLayout(<Component {...pageProps} />)
						)}
					</ModalsProvider>
				</PersistGate>
			</Provider>
		</>
	);
}

function Auth({ children }: { children: any }) {
	const router = useRouter();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const { user, isLoading } = useUser({ skip: !isAuthenticated });

	if (!isAuthenticated) {
		router.replace('/');
		return null;
	}

	if (isLoading) {
		return null;
	}

	if (!user) {
		router.replace('/');
		return null;
	}

	return children;
}
