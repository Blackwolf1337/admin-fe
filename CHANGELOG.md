# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Unreleased

### Added

- Emoji pack configuration

## [1.1.0] - 2019-09-15

### Added

- adds ability to configure new settings (UploadS3 bucket namespace, Rate limit for Activity pub routes, Email notifications settings, MRF Vocabulary, user bio and name length and others)
- adds ability to disable certain features (settings/reports/invites)
- adds sign in via PleromaFE
- adds ability to generate invite tokens and list them on a separate tab
- adds ability to invite users via email
- adds ability to reset users passwords
- adds tests for invites and resetting password

### Changed

- removes "Dashboard" from dropdown menu
- makes all single selects clearable and allow to enter custom values in all multiple selects
- removes legacy activitypub accept_blocks setting 

### Fixed

- converts maps and structs to JS objects, not array of tuples when wrapping config
- changes type of IP value from string to number
- updates error handling for users and invites modules

## [1.0.1] - 2019-08-15

### Fixed

- fixes inputs for renders_errors and rewrite_policy settings
- removes unnecessary computed properties
- enables source maps for production build

## [1.0.0] - 2019-08-14

Starting this changelog, for now we have:

- User management system
- Reports management
- Pleroma configuration (unstable)