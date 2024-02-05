/** @type {Detox.DetoxConfig} */
module.exports = {
  logger: {
    level: process.env.CI ? 'debug' : undefined,
  },
  testRunner: {
    $0: 'jest',
    args: {
      config: 'e2e/jest.config.js',
      _: ['e2e'],
    },
  },
  artifacts: {
    plugins: {
      log: process.env.CI ? 'failing' : undefined,
      screenshot: 'failing',
    },
  },
  apps: {
    'ios.release': {
      type: 'ios.app',
      build:
        'xcodebuild -workspace ios/eastestsexample.xcworkspace -scheme eastestsexample -configuration Release -sdk iphonesimulator -arch x86_64 -derivedDataPath ios/build',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/eastestsexample.app',
    },
    'android.release': {
      type: 'android.apk',
      build:
        'cd android && gradlew.bat :app:assembleRelease :app:assembleAndroidTest -DtestBuildType=release && cd ..',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      testBinaryPath:
          'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
    },
    'android.release.staging': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/releaseStaging/app-releaseStaging.apk',
      testBinaryPath:
          'android/app/build/outputs/apk/androidTest/releaseStaging/app-releaseStaging-androidTest.apk',
      build:
          'cd android &&  bash ./gradlew :app:assembleReleaseStaging :app:assembleAndroidTest -DtestBuildType=releaseStaging && cd ..',
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_3a_API_34_extension_level_7_x86_64',
      },
    },
  },
  configurations: {
    'ios.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.release': {
      device: 'emulator',
      app: 'android.release',
    },
    'android.release.staging': {
      device: 'emulator',
      app: 'android.release.staging',
    },
  },
};
