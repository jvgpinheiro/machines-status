"use client";
import { Asset, assetsAtom } from "@/stores/store";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styles from "./assets.module.css";

export type AssetPreview = Pick<Asset, "name"> &
  Pick<Asset, "model"> &
  Pick<Asset, "image"> &
  Pick<Asset, "status"> &
  Pick<Asset, "companyId"> &
  Pick<Asset, "unitId">;

export default function AssetsComponent(): JSX.Element {
  const data = useRecoilValue(assetsAtom);
  const [selectedAsset, setSelectedAsset] = useState<Asset>();

  useEffect(() => {
    window.addEventListener("click", () => setSelectedAsset(undefined));
  }, []);

  function makeAssetPreview(asset: Asset): JSX.Element {
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
        <div data-testid="asset-preview-healthscore">{asset.healthscore}</div>
        <div data-testid="asset-preview-status">{asset.status}</div>
      </div>
    );
  }

  function makeAssetDetailed(asset: Asset): JSX.Element {
    return (
      <div
        className={styles.assetDetailed}
        data-testid="asset-detailed"
        onClick={(event) => event.stopPropagation()}
      >
        <div data-testid="asset-detailed-image">{asset.image}</div>
        <div data-testid="asset-detailed-name">{asset.name}</div>
        <div data-testid="asset-detailed-model">{asset.model}</div>
        <div data-testid="asset-detailed-healthscore">{asset.healthscore}</div>
        <div data-testid="asset-detailed-status">{asset.status}</div>
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
                {healthData.timestamp}
              </div>
            </div>
          ))}
        </div>
        <div data-testid="asset-detailed-specifications">
          <div data-testid="asset-detailed-specifications-maxTemp">
            {asset.specifications.maxTemp}
          </div>
          <div data-testid="asset-detailed-specifications-power">
            {asset.specifications.power}
          </div>
          <div data-testid="asset-detailed-specifications-rpm">
            {asset.specifications.rpm}
          </div>
        </div>
        <div data-testid="asset-detailed-metrics">
          <div data-testid="asset-detailed-metrics-lastUptimeAt">
            {asset.metrics.lastUptimeAt}
          </div>
          <div data-testid="asset-detailed-metrics-totalCollectsUptime">
            {asset.metrics.totalCollectsUptime}
          </div>
          <div data-testid="asset-detailed-metrics-totalUptime">
            {asset.metrics.totalUptime}
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
        >
          {makeAssetDetailed(selectedAsset)}
        </div>
      )}

      <div
        className={styles.assetsPreviewContainer}
        data-testid="assets-preview-container"
      >
        {data.map((item) => (
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
