import { RecoilRoot } from "recoil";
import { RenderResult, render, waitFor } from "@testing-library/react";
import AssetsComponent from "@/components/assets/assets";
import { getAssets } from "../../../__tests_data__/components/assets/assetsTestData";
import { assetsAtom, Asset } from "@/stores/store";

const baseAssets: Array<Asset> = getAssets();

function renderComponent(assets: Array<Asset>): RenderResult {
  return render(
    <RecoilRoot initializeState={(snap) => snap.set(assetsAtom, assets)}>
      <AssetsComponent></AssetsComponent>);
    </RecoilRoot>
  );
}

function testAssetsQuantity(context: RenderResult, quantity: number): void {
  const { getAllByTestId, getByTestId } = context;
  const assetsContainer = getByTestId("assets-container");
  const assetsPreviewContainer = getByTestId("assets-preview-container");
  const assetElements = getAllByTestId("asset-content");
  expect(assetsContainer).toBeInTheDocument();
  expect(assetsPreviewContainer).toBeInTheDocument();
  expect(assetElements).toHaveLength(quantity);
}

describe("AssetsComponent", () => {
  it("Test 1 asset preview", () => {
    const assets: Array<Asset> = baseAssets.slice(0, 1);
    const renderResult = renderComponent(assets);
    testAssetsQuantity(renderResult, 1);
    testAssetsQuantity(renderResult, assets.length);
    expect(renderResult.queryByTestId("asset-detailed-container")).toBeNull();
  });
  it("Test 2 assets preview", () => {
    const assets: Array<Asset> = baseAssets.slice(0, 2);
    const renderResult = renderComponent(assets);
    testAssetsQuantity(renderResult, 2);
    testAssetsQuantity(renderResult, assets.length);
    expect(renderResult.queryByTestId("asset-detailed-container")).toBeNull();
  });
  it("Test 6 assets preview", () => {
    const assets: Array<Asset> = baseAssets.slice(0, 6);
    const renderResult = renderComponent(assets);
    testAssetsQuantity(renderResult, 6);
    testAssetsQuantity(renderResult, assets.length);
    expect(renderResult.queryByTestId("asset-detailed-container")).toBeNull();
  });
  it("Test preview asset structure", async () => {
    const assets: Array<Asset> = baseAssets.slice(0, 1);
    const { getByTestId } = renderComponent(assets);
    getByTestId("asset-preview");
    getByTestId("asset-preview-image");
    getByTestId("asset-preview-name");
    getByTestId("asset-preview-model");
    getByTestId("asset-preview-healthscore");
    getByTestId("asset-preview-status");
  });
  it("Test detailed asset structure", async () => {
    const assets: Array<Asset> = baseAssets.slice(0, 1);
    const { getAllByTestId, getByTestId } = renderComponent(assets);
    const assetPreview = getByTestId("asset-preview");

    assetPreview.click();
    await waitFor(() => getByTestId("asset-detailed-container"));
    getByTestId("asset-detailed-image");
    getByTestId("asset-detailed-name");
    getByTestId("asset-detailed-model");
    getByTestId("asset-detailed-healthscore");
    getByTestId("asset-detailed-status");
    getByTestId("asset-detailed-sensors");
    getAllByTestId("asset-detailed-sensors-sensor");
    getByTestId("asset-detailed-health-history");
    getAllByTestId("asset-detailed-health");
    getAllByTestId("asset-detailed-health-status");
    getAllByTestId("asset-detailed-health-timestamp");
    getByTestId("asset-detailed-specifications");
    getByTestId("asset-detailed-specifications-maxTemp");
    getByTestId("asset-detailed-specifications-power");
    getByTestId("asset-detailed-specifications-rpm");
    getByTestId("asset-detailed-metrics");
    getByTestId("asset-detailed-metrics-lastUptimeAt");
    getByTestId("asset-detailed-metrics-totalCollectsUptime");
    getByTestId("asset-detailed-metrics-totalUptime");
  });
});
