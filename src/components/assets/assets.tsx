"use client";
import {
  Asset,
  AssetMetrics,
  HealthAssetStatus,
  assetsAtom,
} from "@/stores/store";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./assets.module.css";

type Override<T extends object, U extends { [K in keyof T]?: any }> = Pick<
  T,
  Exclude<keyof T, keyof U>
> &
  U;

type FormattedHealthStatus = Override<HealthAssetStatus, { timestamp: Date }>;
type FormattedMetrics = Override<AssetMetrics, { lastUptimeAt: Date }>;
type CompleteAsset = Override<
  Asset,
  { healthHistory: Array<FormattedHealthStatus>; metrics: FormattedMetrics }
>;

export default function AssetsComponent(): JSX.Element {
  const assetsBaseData = useRecoilValue(assetsAtom);
  const [assets, setAssets] = useState<Array<CompleteAsset>>([]);
  const [selectedAsset, setSelectedAsset] = useState<CompleteAsset>();

  useEffect(() => {
    window.addEventListener("click", () => setSelectedAsset(undefined));
  }, []);

  useEffect(() => {
    const completeAssets = assetsBaseData.map((asset) =>
      buildCompleteAsset(asset)
    );
    setAssets(completeAssets);
  }, [assetsBaseData]);

  function buildCompleteAsset(asset: Asset): CompleteAsset {
    const healthHistory = asset.healthHistory.map((healthStatus) => {
      return {
        status: healthStatus.status,
        timestamp: new Date(healthStatus.timestamp),
      };
    });
    const metrics = {
      ...asset.metrics,
      lastUptimeAt: new Date(asset.metrics.lastUptimeAt),
    };
    return {
      ...asset,
      healthHistory,
      metrics,
    };
  }

  function makeAssetPreview(asset: CompleteAsset): JSX.Element {
    function onAssetPreviewClick(event: MouseEvent<HTMLDivElement>): void {
      event.preventDefault();
      event.stopPropagation();
      setSelectedAsset(asset);
    }

    return (
      <div
        className={styles.assetPreview}
        data-testid="asset-preview"
        onClick={(event) => onAssetPreviewClick(event)}
      >
        <div data-testid="asset-preview-image">{asset.image}</div>
        <div data-testid="asset-preview-name">{asset.name}</div>
        <div data-testid="asset-preview-model">{asset.model}</div>
        <div data-testid="asset-preview-healthscore">{`Health: ${asset.healthscore}%`}</div>
        <div data-testid="asset-preview-status">{`Status: ${asset.status}`}</div>
      </div>
    );
  }

  function makeAssetDetailed(asset: CompleteAsset): JSX.Element {
    return (
      <div
        className={styles.assetDetailed}
        data-testid="asset-detailed"
        onClick={(event) => event.stopPropagation()}
      >
        <div data-testid="asset-detailed-image">{asset.image}</div>
        <div data-testid="asset-detailed-name">{asset.name}</div>
        <div data-testid="asset-detailed-model">{asset.model}</div>
        <div data-testid="asset-detailed-healthscore">{`Health: ${asset.healthscore}%`}</div>
        <div data-testid="asset-detailed-status">{`Status: ${asset.status}`}</div>
        <div data-testid="asset-detailed-sensors">
          {asset.sensors.map((sensor) => (
            <div key={sensor} data-testid="asset-detailed-sensors-sensor">
              {sensor}
            </div>
          ))}
        </div>
        <div data-testid="asset-detailed-health-history">
          {asset.healthHistory.map((healthData, index) => (
            <div key={index} data-testid="asset-detailed-health">
              <div data-testid="asset-detailed-health-status">
                {healthData.status}
              </div>
              <div data-testid="asset-detailed-health-timestamp">
                {healthData.timestamp.toDateString()}
              </div>
            </div>
          ))}
        </div>
        <div data-testid="asset-detailed-specifications">
          <div data-testid="asset-detailed-specifications-maxTemp">
            {`Max temperature: ${
              asset.specifications.maxTemp
                ? `${asset.specifications.maxTemp} ºC`
                : "N/A"
            }`}
          </div>
          <div data-testid="asset-detailed-specifications-power">
            {`Power: ${asset.specifications.power ?? "N/A"}`}
          </div>
          <div data-testid="asset-detailed-specifications-rpm">
            {`RPM: ${asset.specifications.rpm ?? "N/A"}`}
          </div>
        </div>
        <div data-testid="asset-detailed-metrics">
          <div data-testid="asset-detailed-metrics-lastUptimeAt">
            {`Last uptime: ${asset.metrics.lastUptimeAt}`}
          </div>
          <div data-testid="asset-detailed-metrics-totalCollectsUptime">
            {`Total collects uptime: ${asset.metrics.totalCollectsUptime}`}
          </div>
          <div data-testid="asset-detailed-metrics-totalUptime">
            {`Total uptime: ${asset.metrics.totalUptime}`}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.assetsContainer} data-testid="assets-container">
      {selectedAsset && (
        <div
          className={styles.assetDetailedContainer}
          data-testid="asset-detailed-container"
          onClick={(event) => event.stopPropagation()}
        >
          {makeAssetDetailed(selectedAsset)}
        </div>
      )}

      <div
        className={styles.assetsPreviewContainer}
        data-testid="assets-preview-container"
      >
        {assets.map((item) => (
          <div
            className={styles.assetContent}
            key={item.id}
            data-testid="asset-content"
          >
            {makeAssetPreview(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
