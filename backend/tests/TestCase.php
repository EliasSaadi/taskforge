<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected $defaultHeaders;

    protected function setUp(): void
    {
        parent::setUp();

        $this->defaultHeaders = [
            'X-Access-Token' => config('app.access_token'),
        ];
    }
}
