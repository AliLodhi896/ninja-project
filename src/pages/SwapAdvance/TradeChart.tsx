/* @ts-ignore */
import React, { useState, useEffect, useContext, LegacyRef } from 'react';
import {
  createChart,
  ChartOptions,
  DeepPartial,
  AreaStyleOptions,
  SeriesOptionsCommon,
  IChartApi,
} from 'lightweight-charts';
import styled, { ThemeContext } from 'styled-components';
import useResizeObserver from '@react-hook/resize-observer';
import Spinner from 'react-bootstrap/Spinner';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const materialTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: '#eee' },
  },
});

const Table = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 10px;
  box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
  color: rgb(255, 255, 255);

  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 24px;
  border-bottom: 1px solid #2c2f36;

  & span {
    font-size: 25px;
    font-weight: 800;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    justify-content: center;
  `}
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 50%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  `}
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: fit-content;
  font-size: 17px !important;
  font-weight: 600 !important;

  & span {
    font-size: 17px !important;
    font-weight: 600 !important;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    padding-top: 15px;
  `}
`;

const Body = styled.div`
  padding: 18px;

  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 10px;
  margin: 0px 0px;

  @media (max-width: 769px) {
    padding: 8px;
  }
`;

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

type TradeChartProps = {
  data?: any;
  token?: any;
  loading?: boolean;
};
export default function TradeChart({ data, token, loading }: TradeChartProps) {
  const chartRef: LegacyRef<HTMLDivElement> = React.createRef<HTMLDivElement>();
  const tableRef: LegacyRef<HTMLDivElement> = React.createRef<HTMLDivElement>();
  const [tableWidth, setTableWidth] = useState(0);
  const theme = useContext(ThemeContext);

  const [chartElement, setChartElement] = useState<IChartApi | null>(null);
  const [areaSeriesState, setAreaSeriesState] = useState<any | undefined>(undefined);
  const [dataLoadedFirstTime, setDataLoadedFirstTime] = useState(false);

  const [chartType, setChartType] = useState('line');

  const chartTheme = {
    chart: {
      layout: {
        backgroundColor: theme.bg1,
        lineColor: '#2B2B43',
        textColor: '#D9D9D9',
      },
      watermark: {
        color: 'rgba(0, 0, 0, 0)',
      },
      crosshair: {
        color: '#758696',
      },
      grid: {
        vertLines: {
          color: '#2B2B43',
        },
        horzLines: {
          color: '#363C4E',
        },
      },
    } as DeepPartial<ChartOptions>,
    series: {} as DeepPartial<AreaStyleOptions & SeriesOptionsCommon>,
  };

  useEffect(() => {
    if (chartRef && !chartElement) {
      const chart = createChart(chartRef.current as HTMLElement, {
        width: tableWidth,
        height: 300,
        rightPriceScale: {
          borderVisible: false,
          autoScale: true,
        },
        timeScale: {
          timeVisible: true,
          borderVisible: false,
        },
      });

      var areaSeries = chart.addAreaSeries({
        // rgba(240, 185, 11, 1)
        topColor: 'rgba(240, 185, 11, 0.56)',
        bottomColor: 'rgba(240, 185, 11, 0.04)',
        lineColor: 'rgba(240, 185, 11, 1)',
        lineWidth: 2,
        priceFormat: {
          type: 'custom',
          minMove: 0.0000001,
          formatter: (price: any) => parseFloat(price).toFixed(8),
        },
      });

      // areaSeries.applyOptions(chartTheme.series);
      chart.applyOptions(chartTheme.chart);
      chart.timeScale().fitContent();
      setAreaSeriesState(areaSeries);
      setChartElement(chart);
    }
  }, []);

  useResizeObserver(tableRef, (entry: ResizeObserverEntry) => {
    const newWidth = entry?.contentRect?.width;

    if (newWidth && newWidth !== tableWidth) {
      setTableWidth(newWidth);
    }
  });

  useEffect(() => {
    if (chartElement && chartRef) {
      chartElement.resize(tableWidth, 300);
      chartElement.timeScale().fitContent();
    }
  }, [tableWidth, chartElement]);

  useEffect(() => {
    if (chartElement && chartRef && areaSeriesState && !loading && data) {
      const dataArray = data?.data
        .map((trade: any, index: number) => ({
          time: Number(trade.trade_timestamp),
          value: Number(trade.price),
        }))
        .sort((a: any, b: any) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));

      areaSeriesState.setData(dataArray);
      areaSeriesState.setData(dataArray);

      if (!dataLoadedFirstTime) {
        chartElement.timeScale().fitContent();
      }

      setDataLoadedFirstTime(true);
    } else {
      setDataLoadedFirstTime(false);
    }
  }, [data]);

  return (
    <ThemeProvider theme={materialTheme}>
      <Table>
        <Header>
          <HeaderLeft>
            <span>Chart</span>
          </HeaderLeft>
          <HeaderRight>
            <RadioGroup
              aria-label="chartType"
              name="chartType"
              value={chartType}
              row
              onChange={(event) => {
                setChartType(event.target.value);
              }}
            >
              <FormControlLabel value={'line'} control={<Radio color="primary" />} label="Line" />
              <FormControlLabel
                value={'candle'}
                control={<Radio color="primary" />}
                label="Candlestick"
                disabled
              />
            </RadioGroup>
          </HeaderRight>
        </Header>
        <Body ref={tableRef}>
          {loading !== undefined && loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner as="span" animation="border" role="status" aria-hidden="true" />
            </div>
          ) : (
            !data && (
              <div className="d-flex justify-content-center align-items-center">
                <span>Please select token pair to visualize statistics</span>
              </div>
            )
          )}
          <div
            style={{
              width: '100%',
              height: 300,
              borderRadius: '30px',
              ...(data ? {} : { display: 'none' }),
            }}
            ref={chartRef}
          ></div>
        </Body>
      </Table>
    </ThemeProvider>
  );
}
