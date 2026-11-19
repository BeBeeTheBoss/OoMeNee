<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactPageTest extends TestCase
{
    public function test_contact_page_renders_the_telegram_accounts(): void
    {
        $this->get('/contact')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Contact')
                ->where('contacts', [
                    [
                        'username' => '@BeBee2x',
                        'url' => 'https://t.me/BeBee2x',
                    ],
                    [
                        'username' => '@nakeblac613',
                        'url' => 'https://t.me/nakeblac613',
                    ],
                ]));
    }
}
